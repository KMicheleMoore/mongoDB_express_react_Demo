import { useState, useEffect } from 'react';
import '../css/main.css'
import 'font-awesome/css/font-awesome.min.css';
import SpeciesCard from './SpeciesCard';
import speciesService from '../services/speciesService';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Main = ({ updateMessage }) => {

  const [filteredSpecies, setFilteredSpecies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [species, setSpecies] = useState([]);
  const navigate = useNavigate();
    // Maintain page state
    useEffect(() => {
      fetchSpeciesData();
    }, []);

    const fetchSpeciesData = () => {
      speciesService.getSpecies((isSuccessful, response) => {
        if (isSuccessful) {
          setSpecies(response);
          setFilteredSpecies(response);
        } else {
          updateMessage({ content: response, type: 'danger' });
        }
      });
    };

    const handleSearch = () => {
      const searchTermLower = searchTerm.toLowerCase();
      const filteredResults = species.filter((species) => {
        const scientificNameMatch = species.scientific_name.toLowerCase().includes(searchTermLower);
        const commonNamesMatch = species.common_names.some((name) => name.toLowerCase().includes(searchTermLower));
        const typeMatch = species.type.toLowerCase().includes(searchTermLower);
        const pollinatorsMatch = species.pollinators.some((pollinator) => pollinator.toLowerCase().includes(searchTermLower));
    
        return scientificNameMatch || commonNamesMatch || typeMatch || pollinatorsMatch;
      });
    
      setFilteredSpecies(filteredResults);
    };

    const handleDelete = (id) => {
      if (authService.isSignedIn()) {
        speciesService.deleteSpecies(id, (isSuccessful, response) => {
          if (isSuccessful) {
            updateMessage({ content: response, type: 'success' });
            fetchSpeciesData()
          } else {
            navigate('/');
            updateMessage({ content: response, type: 'danger' });
          }
        });
      } else {
        updateMessage({ content: 'You must be signed in to manage species data.', type: 'warning' });
      }
    }

    // Build page
    return ( 
      <div>
        <section className="jumbotron text-center">
          <div className="container">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search this site"
                  onChange={(e) => setSearchTerm(e.target.value)} />
              <div className="input-group-append">
                <button onClick={() => handleSearch()}className="btn btn-secondary" type="button">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="album py-5 bg-light">
          <div className="container">
            <div className="row">
            {filteredSpecies.map((data, index) => (
              // Loop to send each species to card component
              <SpeciesCard key={index} species={data} updateMessage deleteSpecies={handleDelete} />
            ))}
            </div>
          </div>
        </div>
      </div>
    );
}
 
export default Main;