# -*- coding: UTF-8 -*-

import json
# reflect the tables
import time

import numpy as np
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

# Create our session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


@app.route("/")
def home():
    return 'Welcome'

@app.route("/names")
def names():
    country_names = session.query(Asylum.country_name).all()
    country_names = [x[0] for x in country_names]
    
    return jsonify(country_names)

if __name__ == "__main__":
    app.run(debug=True, port=9000)
