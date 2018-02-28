# -*- coding: UTF-8 -*-

import json
# reflect the tables
import time

import numpy as np

# json.dumps(np.int64(685))

# import necessary libraries
import pandas as pd
from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

#################################################
# Database Setup
#################################################

engine = create_engine('sqlite:///refugees_and_conflict.sqlite')

# reflect an existing database into a new model
Base = automap_base()
time.sleep(1)
Base.prepare(engine, reflect=True)
print(Base.classes.keys())
time.sleep(1)

Asylum = Base.classes.asylum
BattleDeaths = Base.classes.battle_deaths
Origin = Base.classes.origin
CountryInfo = Base.classes.info_table

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/names")
def names():
    country_names = session.query(Asylum.country_name).all()
    country_names = [x[0] for x in country_names]

    return jsonify(country_names)


@app.route("/info/<country>")
def info(country):
    info_table = session.query(CountryInfo.country_name, CountryInfo.gdp_YR2015, CountryInfo.population_YR2016,
                               CountryInfo.asylum_YR2016, CountryInfo.origin_YR2016).all()
    info_table = pd.DataFrame(info_table)
    info_table.columns = ['country_name', 'GDP YEAR 2015', 'POPULATION YEAR 2016',
                          'ASYLUM NUMBER YEAR 2016', 'REFUGEE ORIGIN YEAR 2016']
    info_table = info_table.set_index('country_name').to_dict('index')

    data = info_table[country]

    metaData = []

    # for loop to append data for HTML table
    for x, y in data.items():
        xy = {'t0': x, 't1': y}
        metaData.append(xy)

    return jsonify(metaData)


@app.route("/chart/<country>")
def chart(country):
    asylum_table = session.query(Asylum.country_name, Asylum.y1990, Asylum.y1991,
                                 Asylum.y1992, Asylum.y1993, Asylum.y1994, Asylum.y1995, Asylum.y1996,
                                 Asylum.y1997, Asylum.y1998, Asylum.y1999, Asylum.y2000, Asylum.y2001,
                                 Asylum.y2002, Asylum.y2003, Asylum.y2004, Asylum.y2005, Asylum.y2006,
                                 Asylum.y2007, Asylum.y2008, Asylum.y2009, Asylum.y2010, Asylum.y2011,
                                 Asylum.y2012, Asylum.y2013, Asylum.y2014, Asylum.y2015, Asylum.y2016).all()

    asylum_table = pd.DataFrame(asylum_table)
    asylum_table = asylum_table.set_index('country_name').to_dict('index')

    ser = json.dumps(asylum_table, cls=json.JSONEncoder)


    unser = json.loads(ser)

    return jsonify(unser)


@app.route("/data")
def data():
    asylum_data = session.query(Asylum).all()
    origin_data = session.query(Origin).all()
    battle_death_data = session.query(BattleDeaths).all()
    country_objects = []

    for i in range(0, len(asylum_data)):
        country_object = {}
        country_object['country_name'] = asylum_data[i].country_name
        country_object['country_lat'] = asylum_data[i].country_lat
        country_object['country_lon'] = asylum_data[i].country_lon
        country_object['asylum_seekers'] = asylum_data[i].y2016
        country_object['refugees'] = origin_data[i].y2016
        country_object['battle_deaths'] = battle_death_data[i].y2016
        country_objects.append(country_object)

    return jsonify(country_objects)


@app.route("/country/<country>")
def country_info(country):
    country_data = session.query(CountryInfo).filter(
        CountryInfo.country_name == country).first()
    asylum_data = session.query(Asylum).filter(
        Asylum.country_name == country).first()
    origin_data = session.query(Origin).filter(
        Origin.country_name == country).first()
    battle_death_data = session.query(BattleDeaths).filter(
        BattleDeaths.country_name == country).first()

    def get_year_array(data):
        output_array = []
        output_array.append(data.y1990)
        output_array.append(data.y1991)
        output_array.append(data.y1992)
        output_array.append(data.y1993)
        output_array.append(data.y1994)
        output_array.append(data.y1995)
        output_array.append(data.y1996)
        output_array.append(data.y1997)
        output_array.append(data.y1998)
        output_array.append(data.y1999)
        output_array.append(data.y2000)
        output_array.append(data.y2001)
        output_array.append(data.y2002)
        output_array.append(data.y2003)
        output_array.append(data.y2004)
        output_array.append(data.y2005)
        output_array.append(data.y2006)
        output_array.append(data.y2007)
        output_array.append(data.y2008)
        output_array.append(data.y2009)
        output_array.append(data.y2010)
        output_array.append(data.y2011)
        output_array.append(data.y2012)
        output_array.append(data.y2013)
        output_array.append(data.y2014)
        output_array.append(data.y2015)
        output_array.append(data.y2016)

        return output_array

    country_object = {
        'country_name': country_data.country_name,
        'gdp': country_data.gdp_YR2015,
        'population': country_data.population_YR2016,
        'asylum_seekers': asylum_data.y2016,
        'refugees': origin_data.y2016,
        'battle_deaths': battle_death_data.y2016,
        'refugee_years': get_year_array(origin_data),
        'asylum_years': get_year_array(asylum_data),
        'battle_years': get_year_array(battle_death_data),
    }

    return jsonify(country_object)


if __name__ == "__main__":
    app.run(debug=True, port=9000)
