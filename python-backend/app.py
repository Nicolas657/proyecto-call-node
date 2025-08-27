# python-backend/app.py

import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from retell import Retell

# Cargar las variables de entorno desde el archivo .env al inicio
load_dotenv()

# 1. Inicializar la aplicación Flask
app = Flask(__name__)

# 2. Configurar CORS (Cross-Origin Resource Sharing)
# Permite que tu frontend en localhost:3000 envíe peticiones a este backend en localhost:5001.
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# 3. Inicializar el cliente de Retell usando la API Key del entorno
# Se verifica que la clave exista para evitar errores en tiempo de ejecución.
api_key = os.getenv("RETELL_API_KEY")
if not api_key:
    raise ValueError("Error: La variable de entorno RETELL_API_KEY no está definida.")
retell_client = Retell(api_key=api_key)


# 4. Definir la ruta de la API para crear llamadas
@app.route("/api/retell/call", methods=["POST"])
def create_retell_call():
    """
    Endpoint para crear y lanzar una llamada telefónica a través de Retell AI.
    """
    try:
        # Obtener los datos JSON enviados desde el frontend
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se recibió un cuerpo JSON válido."}), 400

        # Extraer los datos necesarios del cuerpo de la petición
        from_number = data.get("from_number")
        agent_id = data.get("agent_id")
        dynamic_variables = data.get("retell_llm_dynamic_variables", {})
        
        # 'to_number' está anidado dentro de las variables dinámicas
        to_number = dynamic_variables.get("to_number")

        # Validación final de los parámetros requeridos
        if not all([from_number, to_number, agent_id]):
            return jsonify({
                "error": "Parámetros incompletos.",
                "details": "Faltan 'from_number', 'agent_id', o 'to_number' (en dynamic_variables)."
            }), 400

        print(f"[Retell API] Intentando llamada con Agente ID: {agent_id}")
        print(f"[Retell API] Variables dinámicas enviadas: {dynamic_variables}")

        # 5. Llamada final y correcta al SDK de Retell
        # Se usa el método 'create_phone_call' anidado en '.call'
        # Se usa el parámetro 'override_agent_id' como lo espera el SDK
        call_response = retell_client.call.create_phone_call(
            from_number=from_number,
            to_number=to_number,
            override_agent_id=agent_id,
            retell_llm_dynamic_variables=dynamic_variables,
        )

        print(f"[Retell API] ¡ÉXITO! Llamada creada con ID: {call_response.call_id}")
        
        # 6. Devolver la respuesta exitosa al frontend
        # .dict() convierte el objeto de respuesta del SDK en un diccionario compatible con JSON
        return jsonify(call_response.dict()), 201

    except Exception as e:
        # 7. Manejo de errores robusto para cualquier problema durante el proceso
        print(f"[Retell API] Ha ocurrido un error al crear la llamada: {e}")
        return jsonify({
            "error": "No se pudo procesar la llamada con Retell AI.",
            "details": str(e)
        }), 500

# 8. Punto de entrada para ejecutar el servidor de desarrollo de Flask
if __name__ == "__main__":
    # Se ejecuta en el puerto 5001 para no interferir con Next.js (puerto 3000)
    # debug=True habilita la recarga automática del servidor al guardar cambios
    app.run(port=5001, debug=True)