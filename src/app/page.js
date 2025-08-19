'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ejecutivas = [
  { nombre: "Marisel Manriquez", telefono: "56983714560" },
  { nombre: "Javiera Roco", telefono: "56920425521" },
  { nombre: "Jocelyn Solís", telefono: "56999623032" },
  { nombre: "Camila Carrizo", telefono: "56986423245" },
  { nombre: "Paola Valdivia", telefono: "56992410906" },
  { nombre: "Fabian Tobar", telefono: "56991709265" },
];

const profesores = [
  { nombre: "Prof. Bruno Palma Carrasco", telefono: "56966595203" },
  { nombre: "Prof. Carmen Tebre Peaspan", telefono: "56947363055" },
  { nombre: "Prof. Francisca Catalina Vera Osorio", telefono: "56953824279" },
  { nombre: "Prof. Ismael Antonio Michillanca Cuevas", telefono: "56994951305" },
  { nombre: "Prof. Ivette Lissette Aguirre Reyes", telefono: "56988876103" },
  { nombre: "Prof. Rodrigo Gonzalo Barrientos Astete", telefono: "56982793595" },
  { nombre: "Prof. Rosa Valentina Valencia Alcaide", telefono: "56948495051" },
  { nombre: "Prof. Tania Carolina Ferreira Villarroel", telefono: "56965255576" },
  { nombre: "Prof. Vivana Garrido Uteau", telefono: "56996439488" },
  { nombre: "Prof. Lorena Marcela Espinoza Bergeret", telefono: "56992428324" },
  { nombre: "Prof. Javiera Soledad Quezada Santana", telefono: "56989098644" },
  { nombre: "Prof. Camila Andrea Veloz Molina", telefono: "56996949762" },
  { nombre: "Prof. Felipe Alfonso Quilaqueo Lancapichun", telefono: "56996001659" },
  { nombre: "Prof. Alfonso Esteban Nuñez Tereucan", telefono: "56951655930" },
  { nombre: "Prof. Maria Ignacia Espinoza Oyarzo", telefono: "56975301180" },
  { nombre: "Prof. Mario Ignacio Larger Vergara", telefono: "56995954452" },
  { nombre: "Prof. Fabian Tobar", telefono: "56991709265" },
  { nombre: "Prof. Bernardo Andres Inostroza Ibarra", telefono: "56979383655" },
];

export default function HomePage() {
  const [clave, setClave] = useState('');
  const [autenticado, setAutenticado] = useState(false);
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({
    nombreAlumno: '',
    celularAlumno: '',
    ejecutiva: '',
    telefonoEjecutiva: '',
    profesor: '',
    telefonoProfesor: '',
    fecha: '',
    hora: '',
    link: '',
    taller: '',
  });
  const [links, setLinks] = useState([]);
  const [tallerSeleccionado, setTallerSeleccionado] = useState(null);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  const formRef = useRef(null);

  const CLAVE_CORRECTA = process.env.NEXT_PUBLIC_CLAVE_CORRECTA;
  const FLOW_1 = process.env.NEXT_PUBLIC_FLOW_ID_1;
  const FLOW_2 = process.env.NEXT_PUBLIC_FLOW_ID_2;

  // Función para obtener talleres únicos
  const obtenerTalleresUnicos = (talleres) => {
    const talleresUnicos = [];
    const vistos = new Set();

    talleres.forEach(taller => {
      const clave = `${taller.profesor}-${taller.taller}-${taller.fecha}-${taller.hora}-${taller.link}`;
      if (!vistos.has(clave)) {
        vistos.add(clave);
        talleresUnicos.push(taller);
      }
    });

    return talleresUnicos;
  };

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get('/api/links');
        const talleresUnicos = obtenerTalleresUnicos(res.data.links || []);
        setLinks(talleresUnicos);
      } catch (err) {
        alert("Error al cargar los talleres disponibles.");
      }
    };
    fetchLinks();
  }, []);

  const handleLogin = () => {
    if (clave === CLAVE_CORRECTA) {
      setAutenticado(true);
    } else {
      alert("Clave incorrecta");
    }
  };

  const buscarAlumno = async () => {
    if (!email.trim()) {
      setErrores({ ...errores, email: 'Ingrese un correo electrónico' });
      return;
    }

    try {
      const res = await axios.get(`/api/search?email=${email}`);
      const celular = res.data.celular;
      setForm(prev => ({
        ...prev,
        nombreAlumno: res.data.nombre || '',
        celularAlumno: celular ? celular.replace(/\D/g, '') : '',
      }));
      setErrores({ ...errores, email: '' });
    } catch (error) {
      alert("Alumno no encontrado");
      setErrores({ ...errores, email: 'Alumno no encontrado' });
    }
  };

  // Validación de campos obligatorios
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!form.nombreAlumno.trim()) nuevosErrores.nombreAlumno = 'Nombre del alumno es obligatorio';
    if (!form.celularAlumno.trim()) nuevosErrores.celularAlumno = 'Celular del alumno es obligatorio';
    if (!form.ejecutiva) nuevosErrores.ejecutiva = 'Debe seleccionar una ejecutiva';
    if (!form.profesor) nuevosErrores.profesor = 'Debe seleccionar un taller';
    if (!form.fecha) nuevosErrores.fecha = 'Fecha es obligatoria';
    if (!form.hora) nuevosErrores.hora = 'Hora es obligatoria';
    if (!form.link) nuevosErrores.link = 'Link es obligatorio';

    // Validar formato de celular (debe tener al menos 8 dígitos)
    if (form.celularAlumno && form.celularAlumno.length < 8) {
      nuevosErrores.celularAlumno = 'Celular debe tener al menos 8 dígitos';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const enviarMensajes = async () => {
    if (!validarFormulario()) {
      alert('Por favor complete todos los campos obligatorios correctamente');
      return;
    }

    setEnviando(true);

    const payload = {
      NOMBREEJECUTIVA: form.ejecutiva,
      TELEFONOALUMNO: form.celularAlumno,
      NOMBREALUMNO: form.nombreAlumno,
      NOMBREPROFESOR: form.profesor,
      TELEFONOPROFESOR: form.telefonoProfesor,
      LINK: form.link,
      HORA: form.hora,
      FECHA: form.fecha,
      NUMEROEJECUTIVA: form.telefonoEjecutiva,
    };

    try {
      await axios.post(`https://flows.messagebird.com/flows/${FLOW_1}/invoke`, payload);
      await axios.post(`https://flows.messagebird.com/flows/${FLOW_2}/invoke`, payload);
      alert("Mensajes enviados correctamente");
      
      // Limpiar formulario después del envío exitoso
      setForm({
        nombreAlumno: '',
        celularAlumno: '',
        ejecutiva: '',
        telefonoEjecutiva: '',
        profesor: '',
        telefonoProfesor: '',
        fecha: '',
        hora: '',
        link: '',
        taller: '',
      });
      setTallerSeleccionado(null);
      setEmail('');
      setErrores({});
    } catch (err) {
      alert("Error al enviar mensajes: " + err.message);
    } finally {
      setEnviando(false);
    }
  };

  const seleccionarTaller = (item, index) => {
    const prof = profesores.find(p => p.nombre === item.profesor);
    setTallerSeleccionado(index);
    setForm((prev) => ({
      ...prev,
      profesor: item.profesor,
      telefonoProfesor: prof?.telefono || '',
      taller: item.taller,
      fecha: item.fecha,
      hora: item.hora,
      link: item.link,
    }));

    // Limpiar errores relacionados con el taller
    setErrores(prev => ({
      ...prev,
      profesor: '',
      fecha: '',
      hora: '',
      link: ''
    }));

    // scroll al formulario
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const actualizarCelular = (valor) => {
    // Solo permitir números
    const soloNumeros = valor.replace(/\D/g, '');
    setForm(prev => ({ ...prev, celularAlumno: soloNumeros }));
    
    // Limpiar error si se corrige
    if (errores.celularAlumno && soloNumeros.length >= 8) {
      setErrores(prev => ({ ...prev, celularAlumno: '' }));
    }
  };

  if (!autenticado) {
    return (
      <div style={styles.login}>
        <div style={styles.loginCard}>
          <h2 style={styles.loginTitle}>🔐 Iniciar Sesión</h2>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Ingrese la clave de acceso"
            style={styles.loginInput}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin} style={styles.loginButton}>
            Ingresar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📚 Sistema de Gestión de Talleres</h1>
        <p style={styles.subtitle}>Selecciona un taller y asigna estudiantes</p>
      </header>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🎯 Talleres Disponibles</h3>
        {links.length === 0 ? (
          <div style={styles.emptyState}>
            <p>📋 No hay talleres disponibles en este momento</p>
          </div>
        ) : (
          <div style={styles.gridContainer}>
            {links.map((item, i) => {
              const seleccionado = i === tallerSeleccionado;
              return (
                <button
                  key={i}
                  onClick={() => seleccionarTaller(item, i)}
                  style={{
                    ...styles.linkButton,
                    ...(seleccionado ? styles.linkButtonSelected : {}),
                  }}
                >
                  <div style={styles.tallerIcon}>
                    {seleccionado ? '✅' : '👨‍🏫'}
                  </div>
                  <div style={styles.tallerInfo}>
                    <div style={styles.profesorName}>{item.profesor}</div>
                    <div style={styles.tallerName}>🧪 {item.taller}</div>
                    <div style={styles.tallerDate}>📅 {item.fecha}</div>
                    <div style={styles.tallerTime}>🕐 {item.hora}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div ref={formRef}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👤 Datos del Estudiante</h3>
          <div style={styles.formGroup}>
            <div style={styles.inputGroup}>
              <input
                type="email"
                placeholder="correo@estudiante.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  ...styles.input,
                  ...(errores.email ? styles.inputError : {})
                }}
              />
              <button 
                onClick={buscarAlumno} 
                style={styles.searchButton}
                disabled={!email.trim()}
              >
                🔍 Buscar
              </button>
            </div>
            {errores.email && <span style={styles.errorText}>{errores.email}</span>}
          </div>
          
          <div style={styles.formGroup}>
            <input 
              value={form.nombreAlumno} 
              placeholder="Nombre del estudiante" 
              readOnly 
              style={{
                ...styles.input,
                ...(errores.nombreAlumno ? styles.inputError : {}),
                backgroundColor: '#f8f9fa'
              }}
            />
            {errores.nombreAlumno && <span style={styles.errorText}>{errores.nombreAlumno}</span>}
          </div>
          
          <div style={styles.formGroup}>
            <input 
              value={form.celularAlumno} 
              placeholder="Número de celular (solo números)" 
              onChange={(e) => actualizarCelular(e.target.value)}
              style={{
                ...styles.input,
                ...(errores.celularAlumno ? styles.inputError : {})
              }}
              maxLength="15"
            />
            {errores.celularAlumno && <span style={styles.errorText}>{errores.celularAlumno}</span>}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👩‍💼 Asignar Ejecutiva</h3>
          <div style={styles.formGroup}>
            <select 
              onChange={(e) => {
                const ej = ejecutivas.find(x => x.nombre === e.target.value);
                setForm({ 
                  ...form, 
                  ejecutiva: ej?.nombre || '', 
                  telefonoEjecutiva: ej?.telefono || '' 
                });
                if (ej && errores.ejecutiva) {
                  setErrores(prev => ({ ...prev, ejecutiva: '' }));
                }
              }} 
              style={{
                ...styles.select,
                ...(errores.ejecutiva ? styles.inputError : {})
              }}
              value={form.ejecutiva}
            >
              <option value="">Selecciona una ejecutiva...</option>
              {ejecutivas.map((e) => (
                <option key={e.nombre} value={e.nombre}>{e.nombre}</option>
              ))}
            </select>
            {errores.ejecutiva && <span style={styles.errorText}>{errores.ejecutiva}</span>}
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>📋 Datos del Taller Seleccionado</h3>
          <div style={styles.tallerDetails}>
            {!form.profesor ? (
              <div style={styles.noSelection}>
                <p>⚠️ Selecciona un taller de la lista superior</p>
              </div>
            ) : (
              <div style={styles.selectedTallerInfo}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>👨‍🏫 Profesor:</span>
                  <span style={styles.infoValue}>{form.profesor}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>📞 Teléfono:</span>
                  <span style={styles.infoValue}>{form.telefonoProfesor}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>🧪 Taller:</span>
                  <span style={styles.infoValue}>{form.taller}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>📅 Fecha:</span>
                  <span style={styles.infoValue}>{form.fecha}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>🕐 Hora:</span>
                  <span style={styles.infoValue}>{form.hora}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>🔗 Link:</span>
                  <span style={styles.linkValue}>{form.link}</span>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={enviarMensajes} 
            style={{
              ...styles.sendButton,
              ...(enviando ? styles.sendButtonDisabled : {})
            }}
            disabled={enviando}
          >
            {enviando ? '📤 Enviando...' : '📬 Enviar Mensajes'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  
  title: {
    color: '#1e293b',
    fontSize: '28px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  
  subtitle: {
    color: '#64748b',
    fontSize: '16px',
    margin: 0,
  },
  
  section: {
    marginBottom: '25px',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  
  sectionTitle: {
    color: '#1e293b',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '20px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '8px',
  },
  
  formGroup: {
    marginBottom: '16px',
  },
  
  inputGroup: {
    display: 'flex',
    gap: '10px',
  },
  
  input: {
    border: '2px solid #e2e8f0',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    width: '100%',
    transition: 'border-color 0.2s ease',
    backgroundColor: 'white',
  },
  
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  
  select: {
    border: '2px solid #e2e8f0',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    width: '100%',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  
  searchButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.2s ease',
  },
  
  errorText: {
    color: '#ef4444',
    fontSize: '12px',
    marginTop: '4px',
    display: 'block',
  },
  
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
    marginTop: '20px',
  },
  
  linkButton: {
    backgroundColor: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    textAlign: 'left',
    height: '100%',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  
  linkButtonSelected: {
    border: '2px solid #22c55e',
    backgroundColor: '#f0fdf4',
    transform: 'scale(1.02)',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
  },
  
  tallerIcon: {
    fontSize: '24px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  
  tallerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  
  profesorName: {
    fontWeight: '600',
    color: '#1e293b',
    fontSize: '14px',
    lineHeight: '1.3',
  },
  
  tallerName: {
    color: '#3b82f6',
    fontSize: '13px',
    fontWeight: '500',
  },
  
  tallerDate: {
    color: '#64748b',
    fontSize: '12px',
  },
  
  tallerTime: {
    color: '#64748b',
    fontSize: '12px',
  },
  
  tallerDetails: {
    marginBottom: '20px',
  },
  
  noSelection: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#fef3c7',
    borderRadius: '8px',
    color: '#92400e',
  },
  
  selectedTallerInfo: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #e2e8f0',
  },
  
  infoLabel: {
    fontWeight: '500',
    color: '#64748b',
    fontSize: '14px',
  },
  
  infoValue: {
    color: '#1e293b',
    fontSize: '14px',
    textAlign: 'right',
    maxWidth: '60%',
  },
  
  linkValue: {
    color: '#3b82f6',
    fontSize: '12px',
    textAlign: 'right',
    maxWidth: '60%',
    wordBreak: 'break-all',
  },
  
  sendButton: {
    backgroundColor: '#22c55e',
    color: 'white',
    padding: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.2s ease',
  },
  
  sendButtonDisabled: {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '2px dashed #cbd5e1',
  },
  
  login: {
    backgroundColor: '#f8fafc',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  
  loginCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  
  loginTitle: {
    color: '#1e293b',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  
  loginInput: {
    border: '2px solid #e2e8f0',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '16px',
    width: '100%',
    marginBottom: '20px',
    textAlign: 'center',
  },
  
  loginButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
  },
};
