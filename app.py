import os
import pandas as pd
from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configuration
SECRET_KEY = os.getenv('SECRET_KEY')
MONGO_URI = os.getenv('MONGO_URI')
CSV_FILE_PATH = 'sample--rates.csv'

app.config['MONGO_URI'] = MONGO_URI
app.config['JWT_SECRET_KEY'] = SECRET_KEY

# Extensions
mongo = PyMongo(app)
jwt = JWTManager(app)
CORS(app)

# Constants
AGE_RANGES = {
    18: '18-24',
    25: '25-35',
    36: '36-40',
    41: '41-45',
    46: '46-50',
    51: '51-55',
    56: '56-60',
    61: '61-65',
    66: '66-70',
    71: '71-75',
}

# Helper function to map age to age range
def map_age_to_range(age):
    for max_age, age_range in AGE_RANGES.items():
        if age <= max_age:
            return age_range
    return '76-99'

# Endpoint for user registration
@app.route('/register', methods=['POST'])
def register():
    user_data = request.get_json()
    username = user_data.get('username')
    password = user_data.get('password')

    if username and password:
        existing_user = mongo.db.users.find_one({'username': username})
        if existing_user:
            return jsonify({'message': 'Username already exists'}), 400
        else:
            mongo.db.users.insert_one({'username': username, 'password': password})
            return jsonify({'message': 'User registered successfully'}), 201

    return jsonify({'message': 'Invalid registration data'}), 400

# Endpoint for user login and token generation
@app.route('/login', methods=['POST'])
def login():
    user_data = request.get_json()
    username = user_data.get('username')
    password = user_data.get('password')

    if username and password:
        user = mongo.db.users.find_one({'username': username, 'password': password})
        if user:
            access_token = create_access_token(identity=username)
            return jsonify({'access_token': access_token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401

# A protected resource that requires a valid token
@app.route('/addInsurance', methods=['POST'])
@jwt_required()
def add_insurance():
    insurance_data = request.get_json()

    # Load CSV data
    insurance_data_frame = pd.read_csv(CSV_FILE_PATH, index_col=False)

    adult_count = 1
    children_count = len(insurance_data["children"])

    age_list = [insurance_data["userAge"]]
    amount_list = [insurance_data["userAmount"]]

    if insurance_data["hasPartner"]:
        amount_list.append(insurance_data['partnerInfo']["amount"])
        age_list.append(insurance_data['partnerInfo']["age"])
        adult_count = 2

    for child_data in insurance_data["children"]:
        amount_list.append(child_data["amount"])
        age_list.append(child_data["age"])

    total = 0
    member_csv = f"{adult_count}a,{children_count}c"

    for i in range(len(amount_list)):
        age_range = map_age_to_range(int(age_list[i]))
        filtered_df = insurance_data_frame[(insurance_data_frame['member_csv'] == member_csv) &
                                           (insurance_data_frame['tier'] == "tier-1") &
                                           (insurance_data_frame['age_range'] == age_range)]
        val = filtered_df.iloc[0][amount_list[i]]

        if i == 0:
            total += val
        else:
            total += val / 2

    return str(total), 200

@app.route('/buy-insurance', methods=['POST'])
@jwt_required()
def buy_insurance():
    insurance_data = request.get_json()
    return "Buy successful"

if __name__ == '__main__':
    app.run(debug=True)
