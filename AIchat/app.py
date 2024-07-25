from flask import Flask, jsonify,render_template, request, flash
from dotenv import load_dotenv
from models import agent_executor

load_dotenv('.env')
app = Flask(__name__)


@app.route('/users', methods=['GET'])
def get_users():
    getUsers = f"SELECT * FROM users"

    try:
        data = query_db(getUsers)    
        return jsonify(data),200
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500



@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    getUser = f"SELECT * FROM users WHERE id=?"

    try:
        data = query_db(getUser, (user_id,))    
        return jsonify(data), 200

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

    return render_template('index.html')



@app.route('/users/add-user', methods=['POST'])
def register_user():
    if not request.is_json:
        return jsonify({"error": "Invalid input, JSON required"}), 400
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    print(id)

   
    if not all([id, name, email, password, role]):
        return jsonify({"error": "Missing data"}), 400

    registerUser = """
        INSERT INTO users (id, name, email, password, role) 
        VALUES (?, ?, ?,?,?)
    """
    
    try:

        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return render_template('index.html')



@app.route('/educate-chat', methods=['GET','POST'])
def educate_chat():
    if not request.is_json:
        return jsonify({"error": "Invalid input, JSON required"}), 400
    data = request.get_json()
    userId = data.get('userId')
    query = data.get('query')

 
    if not all ([userId, query]):
        return jsonify({"error": "Missing query parameter"}), 400

    try:
    
        answer = agent_executor(query)
        questionAsked = answer.get('input')
        answerGiven = answer.get('output')
        print(f"RESPONSE {answerGiven}")
        addChat = """
        INSERT INTO aiChats (id, userId, query, response) 
        VALUES (?, ?, ?, ?)
        """
      
        return jsonify({"response": answerGiven}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)