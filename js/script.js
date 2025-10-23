/* ==========================================================
   Archivo: js/script.js
   Descripción: Lógica de interacción y validaciones en JavaScript
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

	// =====================================================
	// FORMULARIO DE REGISTRO (Dirección de Envío)
	// =====================================================
	const propietario = document.getElementById("propietario");
	const tercero = document.getElementById("tercero");
	const btnEnviar = document.getElementById("btnEnviar");
	const infoConfidencial = document.getElementById("infoConfidencial");
	const campoPostal = document.getElementById("postal");
	const campoReferencia = document.getElementById("referencia");

	// Activar botón enviar solo si propietario está marcado
	if (propietario && btnEnviar) {
		propietario.addEventListener("change", () => {
			btnEnviar.disabled = !propietario.checked;
		});
	}

	// Mostrar información confidencial si tercero está marcado
	if (tercero && infoConfidencial) {
		tercero.addEventListener("change", () => {
			if (tercero.checked) {
				infoConfidencial.classList.remove('hidden');
				infoConfidencial.style.display = 'block';
				// Hacer campos obligatorios
				if (campoPostal) campoPostal.setAttribute('required', 'required');
				if (campoReferencia) campoReferencia.setAttribute('required', 'required');
			} else {
				infoConfidencial.classList.add('hidden');
				infoConfidencial.style.display = 'none';
				// Quitar obligatoriedad
				if (campoPostal) campoPostal.removeAttribute('required');
				if (campoReferencia) campoReferencia.removeAttribute('required');
			}
		});
	}

	// =====================================================
	// MODAL GENÉRICO DINÁMICO
	// =====================================================
	let modalGeneric = document.getElementById('modalGeneric');
	if (!modalGeneric) {
		modalGeneric = document.createElement('div');
		modalGeneric.id = 'modalGeneric';
		modalGeneric.className = 'modal';
		document.body.appendChild(modalGeneric);
	}

	// =====================================================
	// ABRIR MODAL CON CONTENIDO DESDE ARCHIVO HTML
	// =====================================================
	function abrirModal(archivo, templateFallback) {
		const path = 'formularios/' + archivo;
		modalGeneric.innerHTML = '';
		
		const contenido = document.createElement('div');
		contenido.className = 'modal-contenido';
		modalGeneric.appendChild(contenido);

		// Intentar cargar desde archivo
		fetch(path)
			.then(resp => {
				if (!resp.ok) throw new Error('No se pudo cargar');
				return resp.text();
			})
			.then(html => {
				contenido.innerHTML = html;
				modalGeneric.style.display = 'block';
				modalGeneric.classList.add('show');
				
				// Inicializar funcionalidad según el tipo de formulario
				if (archivo === 'form_login.html') {
					inicializarModalLogin();
				} else if (archivo === 'form_registro.html') {
					inicializarModalRegistro();
				} else if (archivo === 'form_producto.html') {
					inicializarModalProducto();
				} else if (archivo === 'form_matricula.html') {
					inicializarModalMatricula();
				}

				// Cerrar modal al hacer clic fuera
				modalGeneric.addEventListener('click', cerrarModalFuera);
				
				// Botón cerrar
				const btnCerrar = modalGeneric.querySelector('.cerrar') || 
				                  modalGeneric.querySelector('.cerrar-modal');
				if (btnCerrar) {
					btnCerrar.addEventListener('click', cerrarModal);
				}
			})
			.catch(err => {
				console.error('Error cargando formulario:', err);
				// Si se proporcionó un template de fallback, usarlo (por ejemplo 'tmplLogin')
				if (templateFallback) {
					const tpl = document.getElementById(templateFallback);
					if (tpl) {
						contenido.innerHTML = '';
						const clone = tpl.content.cloneNode(true);
						contenido.appendChild(clone);
						modalGeneric.style.display = 'block';
						modalGeneric.classList.add('show');

						// Inicializar según el templateFallback
						if (templateFallback === 'tmplLogin') inicializarModalLogin();
						else if (templateFallback === 'tmplRegistro') inicializarModalRegistro();
						else if (templateFallback === 'tmplProducto') inicializarModalProducto();
						else if (templateFallback === 'tmplMatricula') inicializarModalMatricula();

						// asignar listeners de cierre
						modalGeneric.addEventListener('click', cerrarModalFuera);
						const btnCerrar = modalGeneric.querySelector('.cerrar') || modalGeneric.querySelector('.cerrar-modal');
						if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);
						return;
					}
				}

				contenido.innerHTML = '<div style="padding:20px;color:#fff;text-align:center;">No se pudo cargar el formulario. Intenta de nuevo.</div>';
				modalGeneric.style.display = 'block';
				modalGeneric.classList.add('show');
			});
	}

	// =====================================================
	// CERRAR MODAL
	// =====================================================
	function cerrarModal() {
		if (modalGeneric) {
			modalGeneric.style.display = 'none';
			modalGeneric.classList.remove('show');
		}
	}

	function cerrarModalFuera(e) {
		if (e.target === modalGeneric) {
			cerrarModal();
		}
	}

// =====================================================
// INICIALIZAR MODAL DE LOGIN / REGISTRO
// =====================================================
function inicializarModalLogin() {
  const btnIniciar = modalGeneric.querySelector('#btnIniciar');
  const btnRegistrar = modalGeneric.querySelector('#btnRegistrar');
  const loginPanel = modalGeneric.querySelector('#loginPanel');
  const registerPanel = modalGeneric.querySelector('#registerPanel');

  if (!btnIniciar || !btnRegistrar || !loginPanel || !registerPanel) {
    console.error('❌ Error: No se encontraron elementos del modal de login');
    return;
  }

  // =====================================================
  // MOSTRAR PANELES (Login / Registro)
  // =====================================================
  function mostrarLogin() {
    loginPanel.classList.add('active');
    registerPanel.classList.remove('active');
    btnIniciar.parentElement.classList.add('active');
    btnRegistrar.parentElement.classList.remove('active');
  }

  function mostrarRegistro() {
    registerPanel.classList.add('active');
    loginPanel.classList.remove('active');
    btnRegistrar.parentElement.classList.add('active');
    btnIniciar.parentElement.classList.remove('active');
  }

  // Asignar eventos a las pestañas
  btnIniciar.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarLogin();
  });

  btnRegistrar.addEventListener('click', (e) => {
    e.preventDefault();
    mostrarRegistro();
  });

  // Mostrar login por defecto al abrir el modal
  if (loginPanel && registerPanel) {
    loginPanel.classList.add('active');
    registerPanel.classList.remove('active');
  }

  // =====================================================
  // FORMULARIO DE LOGIN - Validación y Autenticación
  // =====================================================
  const formLogin = modalGeneric.querySelector('#FormLoginAvanzado');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!formLogin.checkValidity()) {
        formLogin.reportValidity();
        return;
      }

      const usuario = formLogin.querySelector('#loginUsuario').value.trim();
      const password = formLogin.querySelector('#loginPassword').value.trim();

      if (usuario.length < 3) {
        alert('❌ El usuario debe tener al menos 3 caracteres.');
        return;
      }
      if (password.length < 6) {
        alert('❌ La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      // 🔐 Verificar si el usuario está registrado
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const encontrado = usuarios.find(u =>
        (u.correo === usuario || u.nombre === usuario) && u.password === password
      );

      if (!encontrado) {
        alert('❌ Usuario o contraseña incorrectos.');
        return;
      }

      // Guardar sesión activa
      localStorage.setItem('usuarioActivo', JSON.stringify(encontrado));

      alert(`✅ Bienvenido/a ${encontrado.nombre}`);
      cerrarModal();
      formLogin.reset();

      // Mostrar usuario activo en la interfaz (si existe el contenedor)
      const userStatus = document.getElementById('userStatus');
      if (userStatus) {
        userStatus.innerHTML = `👤 Sesión activa: ${encontrado.nombre} 
          <button id="btnLogout" style="margin-left:10px;">Cerrar sesión</button>`;
        const btnLogout = document.getElementById('btnLogout');
        btnLogout.addEventListener('click', () => {
          localStorage.removeItem('usuarioActivo');
          alert('👋 Sesión cerrada.');
          location.reload();
        });
      }
    });
  }

  // =====================================================
  // FORMULARIO DE REGISTRO - Guardar usuarios
  // =====================================================
  const formRegistro = modalGeneric.querySelector('#FormRegistroAvanzado');
  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!formRegistro.checkValidity()) {
        formRegistro.reportValidity();
        return;
      }

      const nombre = formRegistro.querySelector('#nombre').value.trim();
      const correo = formRegistro.querySelector('#correo').value.trim();
      const password = formRegistro.querySelector('#password').value.trim();

      if (nombre.length < 3 || !correo || password.length < 6) {
        alert('❌ Verifique los campos obligatorios.');
        return;
      }

      // Obtener lista actual de usuarios
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

      // Validar duplicados
      if (usuarios.find(u => u.correo === correo)) {
        alert('⚠️ Este correo ya está registrado.');
        return;
      }

      // Agregar nuevo usuario
      usuarios.push({ nombre, correo, password });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      alert(`✅ Bienvenido/a ${encontrado.nombre}`);
cerrarModal();
formLogin.reset();

// Mostrar usuario activo en la interfaz
const userStatus = document.getElementById('userStatus');
if (userStatus) {
  userStatus.innerHTML = `
    👤 Bienvenido, <strong>${encontrado.nombre}</strong>
    <button id="btnLogout" class="logout-btn">Cerrar sesión</button>
  `;

  // Botón para cerrar sesión
  const btnLogout = document.getElementById('btnLogout');
  btnLogout.addEventListener('click', () => {
    localStorage.removeItem('usuarioActivo');
    alert('👋 Sesión cerrada.');
    location.reload();
  });
}

    });
  }
}

	// =====================================================
	// INICIALIZAR MODAL DE REGISTRO (Dirección de envío)
	// =====================================================
	function inicializarModalRegistro() {
		const m_propietario = modalGeneric.querySelector('#propietario');
		const m_tercero = modalGeneric.querySelector('#tercero');
		const m_btnEnviar = modalGeneric.querySelector('#btnEnviar');
		const m_infoConfidencial = modalGeneric.querySelector('#infoConfidencial');
		const m_postal = modalGeneric.querySelector('#postal');
		const m_referencia = modalGeneric.querySelector('#referencia');

		// Activar botón enviar solo si propietario está marcado
		if (m_propietario && m_btnEnviar) {
			m_propietario.addEventListener('change', () => {
				m_btnEnviar.disabled = !m_propietario.checked;
			});
		}

		// Mostrar información confidencial si tercero está marcado
		if (m_tercero && m_infoConfidencial) {
			m_tercero.addEventListener('change', () => {
				if (m_tercero.checked) {
					m_infoConfidencial.style.display = 'block';
					if (m_postal) m_postal.setAttribute('required', 'required');
					if (m_referencia) m_referencia.setAttribute('required', 'required');
				} else {
					m_infoConfidencial.style.display = 'none';
					if (m_postal) m_postal.removeAttribute('required');
					if (m_referencia) m_referencia.removeAttribute('required');
				}
			});
		}

		// Manejar submit del formulario
		const form = modalGeneric.querySelector('form');
		if (form) {
			form.addEventListener('submit', (e) => {
				e.preventDefault();
				
				if (!form.checkValidity()) {
					form.reportValidity();
					return;
				}

				if (m_btnEnviar) {
					m_btnEnviar.disabled = true;
					m_btnEnviar.textContent = 'ENVIANDO...';
				}

				setTimeout(() => {
					alert('✅ Datos enviados correctamente!');
					cerrarModal();
					form.reset();
					if (m_btnEnviar) {
						m_btnEnviar.disabled = false;
						m_btnEnviar.textContent = 'ENVIAR DATOS';
					}
				}, 900);
			});
		}
	}

	// =====================================================
	// INICIALIZAR MODAL DE PRODUCTO
	// =====================================================
	function inicializarModalProducto() {
		const form = modalGeneric.querySelector('#FormProducto') || 
		             modalGeneric.querySelector('form');
		const btnBorrar = modalGeneric.querySelector('#btnBorrarProducto');

		// Manejar submit del formulario
		if (form) {
			form.addEventListener('submit', (e) => {
				e.preventDefault();
				
				if (!form.checkValidity()) {
					form.reportValidity();
					return;
				}

				const nombreProducto = modalGeneric.querySelector('#nombreProducto').value.trim();
				const descripcion = modalGeneric.querySelector('#descripcion').value.trim();
				const precio = modalGeneric.querySelector('#precio').value;
				const impuesto = modalGeneric.querySelector('#impuesto').value;
				const promocion = modalGeneric.querySelector('input[name="promocion"]:checked').value;

				if (!nombreProducto || !descripcion || !precio || !impuesto) {
					alert('❌ Por favor complete todos los campos obligatorios');
					return;
				}

				alert(`✅ Producto guardado correctamente!\n\n` +
					`Producto: ${nombreProducto}\n` +
					`Descripción: ${descripcion}\n` +
					`Precio: ${precio}\n` +
					`Impuesto: ${impuesto}%\n` +
					`Promoción: ${promocion}`);

				form.reset();
				cerrarModal();
			});
		}

		// Botón borrar
		if (btnBorrar && form) {
			btnBorrar.addEventListener('click', () => {
				if (confirm('¿Está seguro de borrar todos los datos del formulario?')) {
					Array.from(form.elements).forEach(el => {
						if (el.tagName === 'INPUT') {
							const type = el.type.toLowerCase();
							if (['text', 'number', 'email', 'tel', 'password'].includes(type)) {
								el.value = '';
							}
							if (type === 'checkbox') {
								el.checked = false;
							}
							if (type === 'radio' && el.value === 'ninguno') {
								el.checked = true;
							} else if (type === 'radio') {
								el.checked = false;
							}
							if (type === 'file') {
								el.value = null;
							}
						}
						if (el.tagName === 'SELECT') {
							el.selectedIndex = 0;
						}
						if (el.tagName === 'TEXTAREA') {
							el.value = '';
						}
					});
					alert('✅ Formulario limpiado');
				}
			});
		}
	}

	// =====================================================
	// INICIALIZAR MODAL DE MATRÍCULA
	// =====================================================
	function inicializarModalMatricula() {
		const formMatricula = modalGeneric.querySelector('#FormMatricula');
		const btnGuardar = modalGeneric.querySelector('#btnGuardarMatricula');
		const btnLimpiar = modalGeneric.querySelector('#btnLimpiarMatriculas');
		const contenedorMatriculas = modalGeneric.querySelector('#matriculasGuardadas');
		const listaMatriculas = modalGeneric.querySelector('#listaMatriculas');

		// Cargar matrículas guardadas al inicio
		cargarMatriculasGuardadasModal();

		// ENVIAR MATRÍCULA
		if (formMatricula) {
			formMatricula.addEventListener('submit', function(e) {
				e.preventDefault();
				
				if (!formMatricula.checkValidity()) {
					formMatricula.reportValidity();
					return;
				}

				const estudiante = modalGeneric.querySelector('#estudiante').value.trim();
				const codigo = modalGeneric.querySelector('#codigo').value.trim();
				const correo = modalGeneric.querySelector('#correo').value.trim();
				const asignatura = modalGeneric.querySelector('#asignatura').value;
				const semestre = modalGeneric.querySelector('#semestre').value;

				if (!estudiante || !codigo || !correo || !asignatura || !semestre) {
					alert('❌ Todos los campos son obligatorios');
					return;
				}

				alert(`✅ Matrícula enviada correctamente!\n\n` +
					`Estudiante: ${estudiante}\n` +
					`Código: ${codigo}\n` +
					`Correo: ${correo}\n` +
					`Asignatura: ${asignatura}\n` +
					`Semestre: ${semestre}`);

				formMatricula.reset();
			});
		}

		// GUARDAR MATRÍCULA
		if (btnGuardar) {
			btnGuardar.addEventListener('click', function() {
				if (!formMatricula.checkValidity()) {
					alert('❌ Por favor complete todos los campos correctamente');
					formMatricula.reportValidity();
					return;
				}

				const estudiante = modalGeneric.querySelector('#estudiante').value.trim();
				const codigo = modalGeneric.querySelector('#codigo').value.trim();
				const correo = modalGeneric.querySelector('#correo').value.trim();
				const asignatura = modalGeneric.querySelector('#asignatura').value;
				const semestre = modalGeneric.querySelector('#semestre').value;

				const matricula = {
					estudiante: estudiante,
					codigo: codigo,
					correo: correo,
					asignatura: asignatura,
					semestre: semestre,
					fecha: new Date().toLocaleString('es-EC')
				};

				let matriculas = obtenerMatriculas();
				matriculas.push(matricula);
				sessionStorage.setItem('matriculas', JSON.stringify(matriculas));

				alert('✅ Matrícula guardada correctamente!\n\n' +
					`Se ha guardado la matrícula de ${estudiante}`);

				cargarMatriculasGuardadasModal();
				formMatricula.reset();
			});
		}

		// LIMPIAR TODAS LAS MATRÍCULAS
		if (btnLimpiar) {
			btnLimpiar.addEventListener('click', function() {
				if (confirm('¿Está seguro de eliminar todas las matrículas guardadas?')) {
					sessionStorage.removeItem('matriculas');
					cargarMatriculasGuardadasModal();
					alert('✅ Todas las matrículas han sido eliminadas');
				}
			});
		}

		// Función para cargar matrículas dentro del modal
		function cargarMatriculasGuardadasModal() {
			if (!contenedorMatriculas || !listaMatriculas) return;

			const matriculas = obtenerMatriculas();
			
			if (matriculas.length === 0) {
				contenedorMatriculas.style.display = 'none';
				return;
			}

			contenedorMatriculas.style.display = 'block';
			listaMatriculas.innerHTML = '';
			
			matriculas.forEach((mat, index) => {
				const div = document.createElement('div');
				div.className = 'matricula-item';
				div.innerHTML = `
					<strong>Estudiante:</strong> ${mat.estudiante}<br>
					<strong>Código:</strong> ${mat.codigo}<br>
					<strong>Correo:</strong> ${mat.correo}<br>
					<strong>Asignatura:</strong> ${mat.asignatura}<br>
					<strong>Semestre:</strong> ${mat.semestre}º<br>
					<div class="fecha">📅 Guardado: ${mat.fecha}</div>
				`;
				listaMatriculas.appendChild(div);
			});
		}
	}

	// =====================================================
	// EVENTOS PARA ABRIR MODALES
	// =====================================================
	
	// Botón LOGIN del menú
	const btnLogin = document.getElementById('btnLogin');
	const btnLoginLeft = document.getElementById('btnLoginLeft');
	
	if (btnLogin) {
		btnLogin.addEventListener('click', (e) => {
			e.preventDefault();
			abrirModal('form_login.html', 'tmplLogin');
		});
	}

	if (btnLoginLeft) {
		btnLoginLeft.addEventListener('click', (e) => {
			e.preventDefault();
			abrirModal('form_login.html', 'tmplLogin');
		});
	}

	// Enlaces con data-modal
	document.querySelectorAll('[data-modal]').forEach(enlace => {
		enlace.addEventListener('click', (e) => {
			e.preventDefault();
			const modalId = enlace.getAttribute('data-modal');
			
			switch(modalId) {
				case 'modalRegistro':
					abrirModal('form_registro.html', 'tmplRegistro');
					break;
				case 'modalProducto':
					abrirModal('form_producto.html', 'tmplProducto');
					break;
				case 'modalContacto':
					abrirModal('form_contacto.html', 'tmplContacto');
					break;
				case 'modalMatricula':
					abrirModal('form_matricula.html', 'tmplMatricula');
					break;
				case 'modalLogin':
					abrirModal('form_login.html', 'tmplLogin');
					break;
			}
		});
	});

	// =====================================================
	// VALIDACIÓN FORMULARIO DE CONTACTO
	// =====================================================
	window.validar = function() {
		const correoEl = document.getElementById('correo');
		const telefonoEl = document.getElementById('telefono');
		
		if (!correoEl || !telefonoEl) {
			alert('❌ Error: No se encontraron los campos del formulario');
			return false;
		}

		const correo = correoEl.value.trim();
		const telefono = telefonoEl.value.trim();
		const expresion = /^[a-z][\w.\-]+@\w[\w.\-]+\.[a-z]{2,}$/i;

		if (!correo) {
			alert('❌ El correo es obligatorio');
			correoEl.focus();
			return false;
		}

		if (!expresion.test(correo)) {
			alert('❌ Correo inválido. Formato: ejemplo@correo.com');
			correoEl.focus();
			return false;
		}

		if (!telefono) {
			alert('❌ El teléfono es obligatorio');
			telefonoEl.focus();
			return false;
		}

		if (telefono.length !== 10 || isNaN(telefono)) {
			alert('❌ El teléfono debe tener exactamente 10 dígitos numéricos');
			telefonoEl.focus();
			return false;
		}

		return true;
	};

	// =====================================================
	// ENVIAR FORMULARIO (con validación)
	// =====================================================
	window.enviarFormulario = function(boton) {
		if (!boton) return;

		if (validar()) {
			boton.disabled = true;
			boton.value = 'Enviando datos...';
			
			setTimeout(() => {
				alert('✅ Datos enviados correctamente!');
				if (boton.form) boton.form.reset();
				boton.disabled = false;
				boton.value = 'Enviar';
				cerrarModal();
			}, 900);
		}
	};

	// =====================================================
	// SIMULAR ENVÍO (sin validación específica)
	// =====================================================
	window.simulateSubmit = function(button) {
		if (!button) return;
		
		button.disabled = true;
		const original = button.innerText || button.value || 'Enviar';
		
		if (button.tagName === 'INPUT') {
			button.value = 'ENVIANDO...';
		} else {
			button.innerText = 'ENVIANDO...';
		}

		setTimeout(() => {
			alert('✅ Envío completado!');
			
			if (button.tagName === 'INPUT') {
				button.value = original;
			} else {
				button.innerText = original;
			}
			
			button.disabled = false;
			cerrarModal();
		}, 900);
	};

	// =====================================================
	// FUNCIONES AUXILIARES PARA MATRÍCULA
	// =====================================================
	function obtenerMatriculas() {
		try {
			const data = sessionStorage.getItem('matriculas');
			return data ? JSON.parse(data) : [];
		} catch (e) {
			return [];
		}
	}

	// =====================================================
	// FORMULARIO DE MATRÍCULA (fuera del modal)
	// =====================================================
	const formMatricula = document.getElementById('FormMatricula');
	const btnGuardar = document.getElementById('btnGuardarMatricula');
	const btnLimpiar = document.getElementById('btnLimpiarMatriculas');
	const contenedorMatriculas = document.getElementById('matriculasGuardadas');
	const listaMatriculas = document.getElementById('listaMatriculas');

	if (formMatricula) {
		cargarMatriculasGuardadas();

		// ENVIAR MATRÍCULA
		formMatricula.addEventListener('submit', function(e) {
			e.preventDefault();
			
			if (!formMatricula.checkValidity()) {
				formMatricula.reportValidity();
				return;
			}

			const estudiante = document.getElementById('estudiante').value.trim();
			const codigo = document.getElementById('codigo').value.trim();
			const correo = document.getElementById('correo').value.trim();
			const asignatura = document.getElementById('asignatura').value;
			const semestre = document.getElementById('semestre').value;

			if (!estudiante || !codigo || !correo || !asignatura || !semestre) {
				alert('❌ Todos los campos son obligatorios');
				return;
			}

			alert(`✅ Matrícula enviada correctamente!\n\n` +
				`Estudiante: ${estudiante}\n` +
				`Código: ${codigo}\n` +
				`Correo: ${correo}\n` +
				`Asignatura: ${asignatura}\n` +
				`Semestre: ${semestre}`);

			formMatricula.reset();
		});
	}

	// GUARDAR MATRÍCULA
	if (btnGuardar) {
		btnGuardar.addEventListener('click', function() {
			if (!formMatricula.checkValidity()) {
				alert('❌ Por favor complete todos los campos correctamente');
				formMatricula.reportValidity();
				return;
			}

			const estudiante = document.getElementById('estudiante').value.trim();
			const codigo = document.getElementById('codigo').value.trim();
			const correo = document.getElementById('correo').value.trim();
			const asignatura = document.getElementById('asignatura').value;
			const semestre = document.getElementById('semestre').value;

			const matricula = {
				estudiante: estudiante,
				codigo: codigo,
				correo: correo,
				asignatura: asignatura,
				semestre: semestre,
				fecha: new Date().toLocaleString('es-EC')
			};

			let matriculas = obtenerMatriculas();
			matriculas.push(matricula);
			sessionStorage.setItem('matriculas', JSON.stringify(matriculas));

			alert('✅ Matrícula guardada correctamente!\n\n' +
				`Se ha guardado la matrícula de ${estudiante}`);

			cargarMatriculasGuardadas();
			formMatricula.reset();
		});
	}

	// CARGAR MATRÍCULAS
	function cargarMatriculasGuardadas() {
		if (!contenedorMatriculas || !listaMatriculas) return;

		const matriculas = obtenerMatriculas();
		
		if (matriculas.length === 0) {
			contenedorMatriculas.style.display = 'none';
			return;
		}

		contenedorMatriculas.style.display = 'block';
		listaMatriculas.innerHTML = '';
		
		matriculas.forEach((mat, index) => {
			const div = document.createElement('div');
			div.className = 'matricula-item';
			div.innerHTML = `
				<strong>Estudiante:</strong> ${mat.estudiante}<br>
				<strong>Código:</strong> ${mat.codigo}<br>
				<strong>Correo:</strong> ${mat.correo}<br>
				<strong>Asignatura:</strong> ${mat.asignatura}<br>
				<strong>Semestre:</strong> ${mat.semestre}º<br>
				<div class="fecha">📅 Guardado: ${mat.fecha}</div>
			`;
			listaMatriculas.appendChild(div);
		});
	}

	// LIMPIAR MATRÍCULAS
	if (btnLimpiar) {
		btnLimpiar.addEventListener('click', function() {
			if (confirm('¿Está seguro de eliminar todas las matrículas guardadas?')) {
				sessionStorage.removeItem('matriculas');
				cargarMatriculasGuardadas();
				alert('✅ Todas las matrículas han sido eliminadas');
			}
		});
	}

	// =====================================================
	// FORMULARIO DE PRODUCTO (fuera del modal)
	// =====================================================
	const formProducto = document.getElementById('FormProducto');
	const btnBorrarProducto = document.getElementById('btnBorrarProducto');

	if (formProducto && !modalGeneric.contains(formProducto)) {
		// Submit del formulario
		formProducto.addEventListener('submit', function(e) {
			e.preventDefault();
			
			if (!formProducto.checkValidity()) {
				formProducto.reportValidity();
				return;
			}

			const nombreProducto = document.getElementById('nombreProducto').value.trim();
			const descripcion = document.getElementById('descripcion').value.trim();
			const precio = document.getElementById('precio').value;
			const impuesto = document.getElementById('impuesto').value;
			const promocion = document.querySelector('input[name="promocion"]:checked').value;

			if (!nombreProducto || !descripcion || !precio || !impuesto) {
				alert('❌ Por favor complete todos los campos obligatorios');
				return;
			}

			alert(`✅ Producto guardado correctamente!\n\n` +
				`Producto: ${nombreProducto}\n` +
				`Descripción: ${descripcion}\n` +
				`Precio: ${precio}\n` +
				`Impuesto: ${impuesto}%\n` +
				`Promoción: ${promocion}`);

			formProducto.reset();
		});

		// Botón borrar
		if (btnBorrarProducto) {
			btnBorrarProducto.addEventListener('click', function() {
				if (confirm('¿Está seguro de borrar todos los datos del formulario?')) {
					Array.from(formProducto.elements).forEach(el => {
						if (el.tagName === 'INPUT') {
							const type = el.type.toLowerCase();
							if (['text', 'number', 'email', 'tel', 'password'].includes(type)) {
								el.value = '';
							}
							if (type === 'checkbox') {
								el.checked = false;
							}
							if (type === 'radio' && el.value === 'ninguno') {
								el.checked = true;
							} else if (type === 'radio') {
								el.checked = false;
							}
							if (type === 'file') {
								el.value = null;
							}
						}
						if (el.tagName === 'SELECT') {
							el.selectedIndex = 0;
						}
						if (el.tagName === 'TEXTAREA') {
							el.value = '';
						}
					});
					alert('✅ Formulario limpiado');
				}
			});
		}
	}

});