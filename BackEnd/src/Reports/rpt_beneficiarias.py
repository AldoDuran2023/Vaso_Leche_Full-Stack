from src.database.db import mysql
from fpdf import FPDF
from flask import jsonify
from datetime import datetime
from collections import Counter

# obtener los datos de la vista
def obtener_datos():
    """Obtiene los datos de beneficiarias activas desde la base de datos"""
    conexion = mysql.connection
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM vista_beneficiarias_activas")
    filas = cursor.fetchall()
    cursor.close()
    
    datos = []
    for row in filas:
        datos.append({
            "dni": row[2],
            "nombres": row[3],
            "tipo": row[11],
            "hijos": row[8],
            "telefono": row[9],
            "sisfoh": row[10],
            "fecha_registro": row[13]
        })
    return datos

def calcular_estadisticas(datos):
    """Calcula estadísticas básicas de los datos"""
    total_beneficiarias = len(datos)
    total_hijos = sum(int(fila.get("hijos", 0)) for fila in datos)
    
    # Estadísticas por tipo
    tipos = [fila["tipo"] for fila in datos if fila["tipo"]]
    contador_tipos = Counter(tipos)
    
    # Estadísticas por SISFOH
    sisfoh_valores = [fila["sisfoh"] for fila in datos if fila["sisfoh"]]
    contador_sisfoh = Counter(sisfoh_valores)
    
    return {
        "total_beneficiarias": total_beneficiarias,
        "total_hijos": total_hijos,
        "promedio_hijos": round(total_hijos / total_beneficiarias, 2) if total_beneficiarias > 0 else 0,
        "tipos": dict(contador_tipos),
        "sisfoh": dict(contador_sisfoh)
    }

class ReporteProfesionalPDF(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)
        
    def header(self):
        self.set_font("Arial", 'B', 16)
        self.set_text_color(33, 47, 61)  # Azul grisáceo
        self.cell(0, 15, "REPORTE DE BENEFICIARIAS ACTIVAS", ln=True, align='C')
        
        self.set_draw_color(41, 128, 185)  # Azul profesional
        self.set_line_width(0.8)
        self.line(20, 25, 190, 25)
        
        self.set_font("Arial", '', 9)
        self.set_text_color(100, 100, 100)
        fecha_actual = datetime.now().strftime("%d/%m/%Y %H:%M")
        self.cell(0, 8, f"Generado el: {fecha_actual}", ln=True, align='R')
        self.ln(3)

    def footer(self):
        self.set_y(-15)
        self.set_font("Arial", 'I', 8)
        self.set_text_color(130, 130, 130)
        self.cell(0, 10, f"Página {self.page_no()}", 0, 0, 'C')

    def seccion_resumen_ejecutivo(self, estadisticas):
        self.set_font("Arial", 'B', 13)
        self.set_text_color(33, 47, 61)
        self.cell(0, 12, "RESUMEN EJECUTIVO", ln=True)
        
        self.set_draw_color(41, 128, 185)
        self.set_line_width(0.5)
        self.line(20, self.get_y(), 190, self.get_y())
        self.ln(8)
        
        self.crear_caja_estadistica("Total Beneficiarias", str(estadisticas["total_beneficiarias"]), 20, self.get_y())
        self.crear_caja_estadistica("Total Hijos", str(estadisticas["total_hijos"]), 80, self.get_y())
        self.crear_caja_estadistica("Promedio Hijos", str(estadisticas["promedio_hijos"]), 140, self.get_y())
        self.ln(30)

    def crear_caja_estadistica(self, titulo, valor, x, y):
        self.set_fill_color(245, 245, 245)
        self.set_draw_color(200, 200, 200)
        self.rect(x, y, 50, 24, 'DF')

        self.set_xy(x + 2, y + 3)
        self.set_font("Arial", '', 9)
        self.set_text_color(100, 100, 100)
        self.cell(46, 6, titulo, 0, 2, 'C')

        self.set_font("Arial", 'B', 13)
        self.set_text_color(33, 47, 61)
        self.cell(46, 10, valor, 0, 0, 'C')

    def seccion_distribucion_tipos(self, estadisticas):
        self.set_font("Arial", 'B', 12)
        self.set_text_color(33, 47, 61)
        self.cell(0, 12, "DISTRIBUCIÓN POR TIPO DE BENEFICIARIA", ln=True)

        self.set_draw_color(41, 128, 185)
        self.set_line_width(0.5)
        self.line(20, self.get_y(), 190, self.get_y())
        self.ln(6)

        self.set_font("Arial", 'B', 10)
        self.set_fill_color(41, 128, 185)
        self.set_text_color(255, 255, 255)

        self.cell(100, 8, "Tipo de Beneficiaria", 1, 0, 'C', 1)
        self.cell(30, 8, "Cantidad", 1, 0, 'C', 1)
        self.cell(30, 8, "Porcentaje", 1, 1, 'C', 1)

        self.set_font("Arial", '', 10)
        self.set_text_color(33, 47, 61)

        total = estadisticas["total_beneficiarias"]
        for tipo, cantidad in estadisticas["tipos"].items():
            porcentaje = round((cantidad / total) * 100, 1) if total > 0 else 0
            self.cell(100, 8, str(tipo), 1)
            self.cell(30, 8, str(cantidad), 1, 0, 'C')
            self.cell(30, 8, f"{porcentaje}%", 1, 1, 'C')

        self.ln(8)

    def seccion_tabla_detallada(self, datos):
        self.add_page()
        self.set_font("Arial", 'B', 12)
        self.set_text_color(33, 47, 61)
        self.cell(0, 12, "DETALLE DE BENEFICIARIAS ACTIVAS", ln=True)

        self.set_draw_color(41, 128, 185)
        self.line(20, self.get_y(), 190, self.get_y())
        self.ln(6)

        self.set_font("Arial", 'B', 8)
        self.set_fill_color(41, 128, 185)
        self.set_text_color(255, 255, 255)

        anchos = [22, 45, 25, 13, 30, 20, 40]
        cabeceras = ["DNI", "Nombres", "Tipo", "Hijos", "Teléfono", "SISFOH", "Fecha Reg."]

        for i, cabecera in enumerate(cabeceras):
            self.cell(anchos[i], 8, cabecera, 1, 0, 'C', 1)
        self.ln()

        self.set_font("Arial", '', 8)
        self.set_text_color(33, 47, 61)

        for i, fila in enumerate(datos):
            self.set_fill_color(250, 250, 250) if i % 2 == 0 else self.set_fill_color(255, 255, 255)

            self.cell(anchos[0], 7, str(fila["dni"])[:12], 1, 0, '', 1)
            self.cell(anchos[1], 7, self._truncar(fila["nombres"], 28), 1, 0, '', 1)
            self.cell(anchos[2], 7, self._truncar(fila["tipo"], 15), 1, 0, '', 1)
            self.cell(anchos[3], 7, str(fila["hijos"]), 1, 0, 'C', 1)
            self.cell(anchos[4], 7, str(fila["telefono"]), 1, 0, '', 1)
            self.cell(anchos[5], 7, str(fila["sisfoh"]), 1, 0, 'C', 1)
            self.cell(anchos[6], 7, str(fila["fecha_registro"]), 1, 1, '', 1)

            if self.get_y() > 250:
                self.add_page()
                self._crear_cabecera_tabla(anchos, cabeceras)

    def _crear_cabecera_tabla(self, anchos, cabeceras):
        self.set_font("Arial", 'B', 8)
        self.set_fill_color(41, 128, 185)
        self.set_text_color(255, 255, 255)
        for i, cabecera in enumerate(cabeceras):
            self.cell(anchos[i], 8, cabecera, 1, 0, 'C', 1)
        self.ln()

    def _truncar(self, texto, max_len):
        if texto is None:
            return ""
        texto_str = str(texto)
        return texto_str if len(texto_str) <= max_len else texto_str[:max_len - 3] + "..."

    def generar_reporte_completo(self, datos):
        estadisticas = calcular_estadisticas(datos)
        self.add_page()
        self.seccion_resumen_ejecutivo(estadisticas)
        self.seccion_distribucion_tipos(estadisticas)
        self.seccion_tabla_detallada(datos)
        return self
