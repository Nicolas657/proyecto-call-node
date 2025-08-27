'use client';

// Se importa React para poder usar sus tipos, como React.CSSProperties
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';

// --- Definición de Tipos y Constantes ---

// Define la estructura de la respuesta esperada de la API al crear una llamada
interface RetellCallResponse {
  call_id: string;
}

// Define la estructura completa del objeto de variables dinámicas que se enviará
interface DynamicVariables {
  to_number: string;
  firstname: string;
  current_tim: string;
  week: string;
  current_bimester: string;
  fecha_inicio: string;
  risk_level: string;
}

// Constante fija para el agente específico de esta plataforma de pruebas
const AGENT_ID_MAESTRIAS = 'agent_be6e732a54198e22eb2b2713ed';

// Opciones predefinidas para los campos de selección (dropdowns)
const weekOptions = Array.from({ length: 9 }, (_, i) => `Semana${i + 1}`);
const bimesterOptions = ['Bimestre 01', 'Bimestre 02', 'Bimestre 03'];
const riskLevelOptions = ['Alto riesgo académico', 'Riesgo académico', 'Sin riesgo académico'];

// --- Función Auxiliar para Formatear la Fecha ---

/**
 * Genera una cadena de texto con la fecha y hora actual en el formato:
 * 'día, AAAA-MM-DD HH:MM:SS'
 * @returns {string} La fecha y hora formateada.
 */
const getCurrentFormattedTimestamp = (): string => {
  const now = new Date();
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const dayName = days[now.getDay()];

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${dayName}, ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// --- Componente Principal de la Página de Pruebas ---

export default function RetellTestPage() {
  // --- Estados del Componente ---
  const [fromNumber, setFromNumber] = useState('+525593372460'); // Valor por defecto
  
  const [dynamicVariables, setDynamicVariables] = useState<DynamicVariables>({
    to_number: '',
    firstname: '',
    current_tim: getCurrentFormattedTimestamp(), // Se genera al cargar la página
    week: weekOptions[0],
    current_bimester: bimesterOptions[0],
    fecha_inicio: '',
    risk_level: riskLevelOptions[0],
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [callResult, setCallResult] = useState<RetellCallResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Efecto para actualizar la hora cada segundo, asegurando que siempre sea actual
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicVariables(prev => ({
        ...prev,
        current_tim: getCurrentFormattedTimestamp()
      }));
    }, 1000);
    // Limpia el intervalo cuando el componente se desmonta para evitar fugas de memoria
    return () => clearInterval(interval);
  }, []);

  // Manejador genérico para actualizar las variables del formulario
  const handleVariableChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDynamicVariables(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setCallResult(null);
    setError(null);

    try {
      // Petición al backend de Python que corre en el puerto 5001
      const response = await fetch('http://localhost:5001/api/retell/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_number: fromNumber,
          agent_id: AGENT_ID_MAESTRIAS,
          retell_llm_dynamic_variables: dynamicVariables,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.details || result.error || `Error ${response.status}`);
      }
      setCallResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Objeto de Estilos para el Diseño del Componente ---
  const styles: { [key: string]: React.CSSProperties } = {
    main: { padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' },
    container: { maxWidth: '700px', margin: 'auto', backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' },
    header: { borderBottom: '1px solid #e9ecef', paddingBottom: '1rem', marginBottom: '2rem' },
    h1: { margin: 0, fontSize: '1.75rem' },
    p: { margin: '0.25rem 0 0', color: '#6c757d' },
    formSection: { marginBottom: '2rem' },
    legend: { fontWeight: '600', fontSize: '1.2rem', marginBottom: '1.5rem', display: 'block' },
    inputGroup: { marginBottom: '1.25rem' },
    label: { display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#495057' },
    input: { padding: '0.75rem', width: '100%', boxSizing: 'border-box', border: '1px solid #ced4da', borderRadius: '6px', fontSize: '1rem' },
    readOnlyInput: { backgroundColor: '#e9ecef', cursor: 'not-allowed' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
    button: { width: '100%', padding: '0.9rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: '600', transition: 'background-color 0.2s' },
    buttonDisabled: { backgroundColor: '#6c757d', cursor: 'not-allowed' },
    resultBox: { marginTop: '2rem', padding: '1rem', borderRadius: '8px', border: '1px solid' },
    successBox: { backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' },
    errorBox: { backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24' },
  };

  // --- Renderizado del Componente (JSX) ---
  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.h1}>Plataforma de Pruebas de Agentes</h1>
          <p style={styles.p}>Agente de Maestrías: <code>{AGENT_ID_MAESTRIAS}</code></p>
        </header>

        <form onSubmit={handleSubmit}>
          <section style={styles.formSection}>
            <legend style={styles.legend}>Configuración de la Llamada</legend>
            <div style={styles.grid}>
              <div style={styles.inputGroup}>
                <label htmlFor="from_number" style={styles.label}>Número de Origen (Tu # de Retell)</label>
                <input id="from_number" type="tel" value={fromNumber} onChange={(e) => setFromNumber(e.target.value)} placeholder="+1888..." required style={styles.input}/>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="to_number" style={styles.label}>Número de Destino (Contacto)</label>
                <input id="to_number" name="to_number" type="tel" value={dynamicVariables.to_number} onChange={handleVariableChange} placeholder="+5255..." required style={styles.input}/>
              </div>
            </div>
          </section>

          <section style={styles.formSection}>
            <legend style={styles.legend}>Parámetros del Agente (Variables Dinámicas)</legend>
            <div style={{ ...styles.grid, gridTemplateColumns: '1fr 1fr' }}>
              <div style={styles.inputGroup}>
                <label htmlFor="firstname" style={styles.label}>Nombre del Contacto (firstname)</label>
                <input name="firstname" value={dynamicVariables.firstname} onChange={handleVariableChange} required style={styles.input}/>
              </div>
              <div style={styles.inputGroup}>
                <label htmlFor="current_tim" style={styles.label}>Fecha y Hora (current_tim)</label>
                <input name="current_tim" value={dynamicVariables.current_tim} readOnly style={{ ...styles.input, ...styles.readOnlyInput }}/>
              </div>
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="fecha_inicio" style={styles.label}>Fecha de Inicio (fecha_inicio)</label>
              <input name="fecha_inicio" value={dynamicVariables.fecha_inicio} onChange={handleVariableChange} style={styles.input}/>
            </div>
            <div style={styles.grid}>
                <div style={styles.inputGroup}>
                  <label htmlFor="week" style={styles.label}>Semana (week)</label>
                  <select name="week" value={dynamicVariables.week} onChange={handleVariableChange} style={styles.input}>
                    {weekOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div style={styles.inputGroup}>
                  <label htmlFor="current_bimester" style={styles.label}>Bimestre (current_bimester)</label>
                  <select name="current_bimester" value={dynamicVariables.current_bimester} onChange={handleVariableChange} style={styles.input}>
                    {bimesterOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="risk_level" style={styles.label}>Nivel de Riesgo (risk_level)</label>
              <select name="risk_level" value={dynamicVariables.risk_level} onChange={handleVariableChange} style={styles.input}>
                {riskLevelOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </section>

          <button type="submit" disabled={isLoading || !fromNumber || !dynamicVariables.to_number} style={{ ...styles.button, ...(isLoading || !fromNumber || !dynamicVariables.to_number ? styles.buttonDisabled : {}) }}>
            {isLoading ? 'Llamando...' : 'Iniciar Llamada de Prueba'}
          </button>
        </form>

        {callResult && (
          <div style={{...styles.resultBox, ...styles.successBox}}>
            <h3>✅ Llamada iniciada con éxito</h3>
            <p style={{ margin: '0.5rem 0 0' }}><strong>ID de la llamada:</strong> {callResult.call_id}</p>
          </div>
        )}
        {error && (
          <div style={{...styles.resultBox, ...styles.errorBox}}>
            <h3>❌ Error al iniciar la llamada</h3>
            <p style={{ margin: '0.5rem 0 0' }}>{error}</p>
          </div>
        )}
      </div>
    </main>
  );
}