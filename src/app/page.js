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

  const formRef = useRef(null);

  const CLAVE_CORRECTA = process.env.NEXT_PUBLIC_CLAVE_CORRECTA;
  const FLOW_1 = process.env.NEXT_PUBLIC_FLOW_ID_1;
  const FLOW_2 = process.env.NEXT_PUBLIC_FLOW_ID_2;

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get('/api/links');
        setLinks(res.data.links || []);
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
    try {
      const res = await axios.get(`/api/search?email=${email}`);
      const celular = res.data.celular;
      setForm(prev => ({
        ...prev,
        nombreAlumno: res.data.nombre || '',
        celularAlumno: celular ? celular.replace(/\D/g, '') : '',
      }));
    } catch (error) {
      alert("Alumno no encontrado");
    }
  };

  const enviarMensajes = async () => {
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
    } catch (err) {
      alert("Error al enviar mensajes: " + err.message);
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

    // scroll al formulario
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  if (!autenticado) {
    return (
      <div style={styles.login}>
        <h2>Iniciar Sesión</h2>
        <input
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          placeholder="Clave"
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button('#FF7F50')}>Ingresar</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h3>Selecciona un taller disponible</h3>
        {links.length === 0 ? (
          <p>No hay talleres disponibles</p>
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
                    border: seleccionado ? '2px solid #22c55e' : styles.linkButton.border,
                    backgroundColor: seleccionado ? '#e6ffed' : styles.linkButton.backgroundColor,
                    fontWeight: seleccionado ? 'bold' : 'normal',
                  }}
                >
                  {seleccionado ? '✅' : '👨‍🏫'} {item.profesor}<br />
                  🧪 {item.taller}<br />
                  📅 {item.fecha}<br />
                  🕐 {item.hora}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div ref={formRef}>
        <div style={styles.section}>
          <h3>Datos del alumno</h3>
          <input
            type="email"
            placeholder="Correo del Alumno"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <button onClick={buscarAlumno} style={styles.button('#60A5FA')}>Buscar Alumno</button>
          <input value={form.nombreAlumno} placeholder="Nombre del Alumno" readOnly style={styles.input} />
          <input value={form.celularAlumno} placeholder="Celular del Alumno" style={styles.input} />
        </div>

        <div style={styles.section}>
          <h3>Asignar ejecutiva</h3>
          <select onChange={(e) => {
            const ej = ejecutivas.find(x => x.nombre === e.target.value);
            setForm({ ...form, ejecutiva: ej?.nombre, telefonoEjecutiva: ej?.telefono });
          }} style={styles.input}>
            <option value="">Selecciona Ejecutiva</option>
            {ejecutivas.map((e) => (
              <option key={e.nombre}>{e.nombre}</option>
            ))}
          </select>
        </div>

        <div style={styles.section}>
          <h3>Datos del Taller Seleccionado</h3>
          <input value={form.profesor} placeholder="Profesor" readOnly style={styles.input} />
          <input value={form.telefonoProfesor} placeholder="Teléfono del Profesor" readOnly style={styles.input} />
          <input value={form.taller} placeholder="Taller" readOnly style={styles.input} />
          <input value={form.fecha} placeholder="Fecha" readOnly style={styles.input} />
          <input value={form.hora} placeholder="Hora" readOnly style={styles.input} />
          <input value={form.link} placeholder="Link" readOnly style={styles.input} />
          <button onClick={enviarMensajes} style={styles.button('#FF7F50')}>Enviar Mensajes</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Poppins, sans-serif',
    backgroundColor: '#f4f4f9',
    minHeight: '100vh',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '30px',
  },
  input: {
    border: '2px solid #60A5FA',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '10px',
    width: '100%',
  },
  button: (color) => ({
    backgroundColor: color,
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '100%',
    border: 'none',
    marginBottom: '10px',
  }),
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '12px',
    marginTop: '10px',
  },
  linkButton: {
    backgroundColor: '#fff',
    border: '1px solid #60A5FA',
    borderRadius: '8px',
    padding: '8px',
    fontSize: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    lineHeight: '1.4',
    height: '100%',
  },
  login: {
    backgroundColor: '#f4f4f9',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
};
