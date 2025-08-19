document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('miFormulario');
  const btnEnviar = document.getElementById('btnEnviar');
  const successMsg = document.getElementById('success-message');

  const regex = {
    nombre: /^[A-Za-z\s]{3,}$/,
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    contraseña: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    celular: /^3\d{9}$/
  };

  function validarEdad(fecha) {
    if (!fecha) return false;
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad >= 18;
  }

  function mostrarError(id, mensaje) {
    document.getElementById('error-' + id).textContent = mensaje;
    const input = form[id];
    if (input) {
      if (mensaje) {
        input.classList.remove('valid');
        input.classList.add('invalid');
      } else {
        input.classList.remove('invalid');
        input.classList.add('valid');
      }
    }
  }

  function limpiarErrores() {
    document.querySelectorAll('.error-message').forEach(div => div.textContent = '');
    successMsg.textContent = '';
    document.querySelectorAll('input').forEach(input => {
      input.classList.remove('valid', 'invalid');
    });
  }

  function validarCampo(id, value) {
    switch(id) {
      case 'nombre':
        return regex.nombre.test(value);
      case 'correo':
        return regex.correo.test(value);
      case 'contraseña':
        return regex.contraseña.test(value);
      case 'confirmar':
        return value === form.contraseña.value && value.length >= 8;
      case 'fecha':
        return validarEdad(value);
      case 'celular':
        return regex.celular.test(value);
      case 'terminos':
        return form.terminos.checked;
      default:
        return true;
    }
  }

  // Validación en tiempo real solo si el campo tiene valor
  form.addEventListener('input', (e) => {
    const id = e.target.id;
    if (!id || id === 'btnEnviar') return;
    let value = e.target.value.trim();
    let error = '';
    if (value !== '') {
      switch(id) {
        case 'nombre':
          if (!validarCampo('nombre', value)) error = 'Debe tener al menos 3 letras y solo caracteres válidos.';
          break;
        case 'correo':
          if (!validarCampo('correo', value)) error = 'Correo electrónico inválido.';
          break;
        case 'contraseña':
          if (!validarCampo('contraseña', value)) error = 'Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.';
          break;
        case 'confirmar':
          if (!validarCampo('confirmar', value)) error = 'Las contraseñas no coinciden.';
          break;
        case 'fecha':
          if (!validarCampo('fecha', value)) error = 'Debes tener al menos 18 años.';
          break;
        case 'celular':
          if (!validarCampo('celular', value)) error = 'Debe ser un número celular colombiano válido (10 dígitos, inicia con 3).';
          break;
      }
    } else {
      error = '';
      e.target.classList.remove('valid', 'invalid');
    }
    mostrarError(id, error);
  });

  // Validación al enviar
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    limpiarErrores();
    let valido = true;

    // Validar todos los campos obligatorios
    const campos = [
      {id: 'nombre', msg: 'Debe tener al menos 3 letras y solo caracteres válidos.'},
      {id: 'correo', msg: 'Correo electrónico inválido.'},
      {id: 'contraseña', msg: 'Mínimo 8 caracteres, una mayúscula, un número y un carácter especial.'},
      {id: 'confirmar', msg: 'Las contraseñas no coinciden.'},
      {id: 'fecha', msg: 'Debes tener al menos 18 años.'},
      {id: 'celular', msg: 'Debe ser un número celular colombiano válido (10 dígitos, inicia con 3).'}
    ];

    campos.forEach(campo => {
      const value = form[campo.id].value.trim();
      if ((campo.id !== 'telefono' && value === '') || !validarCampo(campo.id, value)) {
        mostrarError(campo.id, campo.msg);
        valido = false;
      } else {
        mostrarError(campo.id, '');
      }
    });

    // Términos
    if (!validarCampo('terminos')) {
      mostrarError('terminos', 'Debes aceptar los términos.');
      valido = false;
    } else {
      mostrarError('terminos', '');
    }

    if (valido) {
      successMsg.textContent = '¡Formulario enviado correctamente!';
      form.reset();
      document.querySelectorAll('input').forEach(input => {
        input.classList.remove('valid', 'invalid');
      });
    }
  });
  document.querySelectorAll('.toggle-password').forEach(btn => {
  btn.addEventListener('click', function() {
    const input = this.previousElementSibling;
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});
});

