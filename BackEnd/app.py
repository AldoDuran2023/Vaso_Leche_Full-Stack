from flask import Flask
from flask_cors import CORS
from src.database.db import init_db, mysql
from src.routes.routesBeneficiarias import beneficiarias
from src.routes.routesAsistencias import asistencias
from src.routes.routesCargos import cargos
from src.routes.routesDetalleIngresos import detalle_ingreso
from src.routes.routesDetallesEntregas import detalles_entregas
from src.routes.routesEntregas import entregas
from src.routes.routesHijos import hijos
from src.routes.routesInventarios import inventarios
from src.routes.routesJuntas import juntas
from src.routes.routesMovimientos import movimientos
from src.routes.routesMultas import multas
from src.routes.routesRepresentantes import representantes
from src.routes.routesReuniones import reuniones
from src.routes.routesGastos import gastos
from src.routes.routesDashboard import dashboard
from src.routes.auth import auth
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
app.config['SECRET_KEY'] = os.getenv('SECRET')

init_db(app)

app.register_blueprint(beneficiarias, url_prefix='/api/beneficiarias')
app.register_blueprint(gastos, url_prefix='/api/gastos')
app.register_blueprint(asistencias, url_prefix='/api/asistencias')
app.register_blueprint(cargos, url_prefix='/api/cargos')
app.register_blueprint(detalle_ingreso, url_prefix='/api/detalle_ingreso')
app.register_blueprint(detalles_entregas, url_prefix='/api/detalles_entregas')
app.register_blueprint(entregas, url_prefix='/api/entregas')
app.register_blueprint(hijos, url_prefix='/api/hijos')
app.register_blueprint(inventarios, url_prefix='/api/inventarios')
app.register_blueprint(juntas, url_prefix='/api/juntas')
app.register_blueprint(multas, url_prefix='/api/multas')
app.register_blueprint(representantes, url_prefix='/api/representantes')
app.register_blueprint(reuniones, url_prefix='/api/reuniones')
app.register_blueprint(movimientos, url_prefix='/api/movimientos')
app.register_blueprint(auth)
app.register_blueprint(dashboard)

@app.route("/")
def index():
    cur = mysql.connection.cursor()
    cur.execute("SELECT NOW()")
    result = cur.fetchone()
    return f"La hora actual del servidor MySQL es: {result[0]}"

if __name__ == '__main__':
    app.run(debug=True)
