import PropTypes from "prop-types";
import { Person } from "./Person";
import { useState } from "react";

export const People = ({ people, setPeople }) => {

  // Estado para gestionar el Id de la persona que se está editando
  const [editingId, setEditingId] = useState(null);

  // Estado para establecer si se está editando a una persona
  const [isEditing, setIsEditing] = useState(false);

  // Estado para almacenar temporalmente los datos de la persona que se está editando
  const [editedPerson, setEditedPerson] = useState(
    {
      name: '',
      role: '',
      img: ''
    }
  );

  // Estado para gestionar a la persona que vamos a eliminar del array
  const [personToDelete, setPersonToDelete] = useState(null);

  // Método para gestionar los campos del formulario 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPerson(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Método para crear una nueva persona en el Team
  const handleCreate = (e) => {
    e.preventDefault();

    // Agregar una persona al array
    setPeople([...people, { id: people.length + 1, ...editedPerson }]);

    // Reiniciar el estado del formulario 
    setEditedPerson({ name: '', role: '', img: '' });
  };

  // Método para editar a una persona
  const handleEdit = (id) => {

    setEditingId(id);
    setIsEditing(true);
    const personToEdit = people.find(person => person.id === id);

    setEditedPerson({ ...personToEdit });
  };

  // Método para guardar los cambios después de editar a una persona
  const handleSave = (e) => {

    // Prevenir recarga automática del navegador
    e.preventDefault();

    // Crear un array nuevo reemplazando los datos de la persona editada
    const updatePeople = people.map(person => person.id === editingId ? editedPerson : person);

    // Actualizar el estado de personas con el array actualizado
    setPeople(updatePeople);

    setIsEditing(false);

    setEditingId(null);

    setEditedPerson({
      name: '',
      role: '',
      img: ''
    });
  }

  // Métodos para eliminar una persona del array

  // Método #1: guardar el id de la persona a eliminar
  const handleDelete = (id) => {
    setPersonToDelete(id);
  };

  // Método #2: confirmar la eliminación
  const confirmDelete = () => {

    // Filtrar el array de personas, eliminando la persona que coincide con el id
    setPeople(people.filter(person => person.id !== personToDelete));

    setPersonToDelete(null);
  };

  // Método #3: cancelar la eliminación
  const cancelDelete = () => {
    setPersonToDelete(null);
  };


  return (
    <div>
      <h2 className='text-center my-4'>IT Team</h2>
      <div className='container'>
        <div className='row d-flex flex-wrap row-cols-1 row-cols-md-2 row-cols-lg-3'>
          {
            people.map((people) => {
              return (
                <div key={people.id}>
                  <Person
                    id={people.id}
                    name={people.name}
                    img={people.img}
                    role={people.role}
                    handleEdit={() => handleEdit(people.id)}
                    handleDelete={() => handleDelete(people.id)}
                  />
                </div>
              );
            })
          }
        </div>
      </div>
      {/* Formulario */}
      <div className='container'>
        <h2 className='text-center mt-4' > {isEditing ? 'Actualizar Empleado' : 'Crear Nuevo Empleado'} </h2>
        <form>
          <div>
            <label htmlFor="name">Nombres</label>
            <input type="text" name="name" value={editedPerson.name} onChange={handleChange} required className="form-control" />
          </div>
          <div>
            <label htmlFor="role">Rol</label>
            <input type="text" name="role" value={editedPerson.role} onChange={handleChange} required className="form-control" />
          </div>
          <div>
            <label htmlFor="img">Avatar</label>
            <input type="text" name="img" value={editedPerson.img} onChange={handleChange} required className="form-control" />
          </div>
          <div className="mt-2 text-center">
            <button type="submit" className="btn btn-primary" onClick={isEditing ? handleSave : handleCreate}> {isEditing ? 'Actualizar' : 'Crear'} </button>
          </div>
        </form>
      </div>
      {/* Modal de confirmación  para eliminar */}
      <div id="deleteModal" className="modal fade" tabIndex="-1" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Confirmar Eliminación</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={cancelDelete}></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de eliminar a {people.find(person => person.id === personToDelete)?.name} ?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={cancelDelete}>Cancelar</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={confirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

People.propTypes = {
  people: PropTypes.array,
  setPeople: PropTypes.func
}
