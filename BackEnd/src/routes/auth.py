from flask import Blueprint, request, jsonify
from src.database.db import mysql
from werkzeug.security import generate_password_hash, check_password_hash
from src.utils.funcionJWT import write_token, validate_token
from flask_cors import cross_origin

auth = Blueprint("auth", __name__)

import traceback

@auth.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"message": "Datos no válidos"}), 400

        username = data.get('username')
        password = data.get('password')

        if not all([username, password]):
            return jsonify({"message": "Faltan datos"}), 400

        cursor = mysql.connection.cursor()
        cursor.execute("""
            SELECT 
                u.id_usuario, 
                u.username, 
                u.fullname, 
                u.contrasena, 
                u.fk_representante,
                r.fk_cargo,
                r.fk_junta_directiva,
                j.nombre_anio,
                c.cargo
            FROM usuarios u
            LEFT JOIN representantes r ON u.fk_representante = r.id_representante
            LEFT JOIN juntas_directivas j ON r.fk_junta_directiva = j.id_junta_directiva
            join cargos c on c.id_cargo = r.fk_cargo
            WHERE u.username = %s
        """, (username,))
        row = cursor.fetchone()
        cursor.close()

        if row:
            id_usuario, username_db, fullname, hashed_password, fk_representante, rol, fk_junta, nombre_anio, cargo = row
            if check_password_hash(hashed_password, password):
                token = write_token({
                    "id_usuario": id_usuario,
                    "username": username_db,
                    "fullname": fullname,
                    "fk_representante": fk_representante,
                    "rol": rol,
                    "fk_junta": fk_junta,
                    "nombre_anio_junta": nombre_anio,
                    "cargo": cargo
                })

                return jsonify({"token": token}), 200

        return jsonify({"message": "Credenciales incorrectas"}), 401
    
    except Exception as e:
        print("=== ERROR EN LOGIN ===")
        traceback.print_exc()
        return jsonify({"error": "Error interno en el servidor"}), 500


@auth.route('/verify/token')
def verify():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token requerido"}), 403
    try:
        token = token.split(" ")[1]
        return validate_token(token, output=True)
    except Exception as e:
        return jsonify({"message": "Token inválido", "error": str(e)}), 403


# Ruta para crear usuario
@auth.route('/api/usuarios/create', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    fullname = data.get('fullname')
    fk_representante = data.get('fk_representante')

    if not all([username, password, fullname, fk_representante]):
        return jsonify({"message": "Faltan datos"}), 400

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT id_usuario FROM usuarios WHERE username = %s", (username,))
    if cursor.fetchone():
        return jsonify({"message": "El usuario ya existe"}), 409

    hashed_password = generate_password_hash(password)

    cursor.execute("""
        INSERT INTO usuarios (username, contrasena, fullname, fk_representante)
        VALUES (%s, %s, %s, %s)
    """, (username, hashed_password, fullname, fk_representante))
    mysql.connection.commit()
    cursor.close()

    return jsonify({"message": "Usuario creado exitosamente"}), 201

# Ruta para actualizar usuario
@auth.route('/api/usuarios/update/<int:id_usuario>', methods=['PUT'])
def update_user(id_usuario):
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    fullname = data.get('fullname')
    fk_representante = data.get('fk_representante')

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE id_usuario = %s", (id_usuario,))
    if not cursor.fetchone():
        return jsonify({"message": "Usuario no encontrado"}), 404

    # Verificar que no se repita username
    cursor.execute("SELECT * FROM usuarios WHERE username = %s AND id_usuario != %s", (username, id_usuario))
    if cursor.fetchone():
        return jsonify({"message": "El nombre de usuario ya está en uso"}), 409

    # Actualizar
    query = """
        UPDATE usuarios
        SET username = %s, fullname = %s, fk_representante = %s {contrasena_clause}
        WHERE id_usuario = %s
    """
    if password:
        hashed = generate_password_hash(password)
        cursor.execute(query.format(contrasena_clause=", contrasena = %s"), (username, fullname, fk_representante, hashed, id_usuario))
    else:
        cursor.execute(query.format(contrasena_clause=""), (username, fullname, fk_representante, id_usuario))

    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Usuario actualizado correctamente"}), 200


# Ruta para obtener todos los usuarios
@auth.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token requerido"}), 403
    try:
        token = token.split(" ")[1]
        validate_token(token)
    except Exception as e:
        return jsonify({"message": "Token inválido", "error": str(e)}), 403

    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT u.id_usuario, u.username, u.fullname,
               c.cargo AS rol_nombre, r.estado
        FROM usuarios u
        LEFT JOIN representantes r ON u.fk_representante = r.id_representante
        LEFT JOIN cargos c ON r.fk_cargo = c.id_cargo
    """)
    rows = cursor.fetchall()
    cursor.close()

    data = []
    for row in rows:
        data.append({
            "id_usuario": row[0],
            "username": row[1],
            "fullname": row[2],
            "rol": row[3],
            "estado": row[4]
        })

    return jsonify({"data": data}), 200


# NUEVA RUTA: Obtener usuario específico por ID
@auth.route('/api/usuarios/<int:id_usuario>', methods=['GET'])
def get_usuario_by_id(id_usuario):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token requerido"}), 403
    try:
        token = token.split(" ")[1]
        validate_token(token)
    except Exception as e:
        return jsonify({"message": "Token inválido", "error": str(e)}), 403

    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT id_usuario, username, fullname, fk_representante
        FROM usuarios WHERE id_usuario = %s
    """, (id_usuario,))
    row = cursor.fetchone()
    cursor.close()

    if not row:
        return jsonify({"message": "Usuario no encontrado"}), 404

    data = {
        "id_usuario": row[0],
        "username": row[1],
        "fullname": row[2],
        "fk_representante": row[3]
    }

    return jsonify(data), 200
