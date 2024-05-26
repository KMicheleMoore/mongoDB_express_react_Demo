import { Link } from 'react-router-dom';

const SpeciesCard = ({ species, deleteSpecies }) => {

  return (
    <div className="col-md-4">
      <div className="card mb-4 box-shadow">

        {/*Image*/}
        <img
          className="card-img-top"
          alt={`Flower of ${species.scientific_name}`}
          style={{ height: 225, width: '100%', display: 'block', objectFit: 'cover' }}
          src={species.img}
        />
        <div className="card-body">

          {/*Title*/}
          <h5 className="card-title">{species.scientific_name}</h5>
          <h6 className="card-subtitle">
            {`Common name${species.common_names.length > 1 ? `s` : `` }:`}
          </h6>
          <p className="text-capitalize">
            {species.common_names.join(', ')}
          </p>
        </div>

        {/*Actions*/}
        <div className="card-footer d-flex">
              <Link to={`/view/${species._id}`} className="btn btn-outline-primary flex-fill m-1">
                View
              </Link>
              <Link to={`/edit/${species._id}`} className="btn btn-outline-secondary flex-fill m-1">
                Edit
              </Link>
              <button onClick={() => deleteSpecies(species._id)} className="btn btn-outline-danger flex-fill m-1">
                Delete
              </button>
          </div>
      </div>
    </div>
  );
};

export default SpeciesCard;