import '../css/signin.css';
import { useForm} from 'react-hook-form';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const SignIn = ({updateMessage}) => {

    const { register, handleSubmit, formState: { errors }} = useForm();
    const navigate = useNavigate();

    const sendCredentials = (credentials) => {
      authService.signin(credentials, (isSuccessful, response) => {

        if (isSuccessful) {
          navigate('/');
        } else {
          navigate('/signin')
          updateMessage({content: response, type: 'danger'});
        }
      });
    };

    const emailRules = {
      required: "Email is required.",
      pattern: {
        value: /\S+@\S+\.\S+/,
        message: "Please enter a valid email",
      }
    }

    const passwordRules = {
      required: "Password is required."
    }

    return ( 
        <form onSubmit={handleSubmit(sendCredentials)} className="form-signin">
            <h1 className="h3 mb-3 font-weight-normal text-center">Please sign in</h1>

            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input {...register('email', emailRules)} id="inputEmail" className="form-control m-2" placeholder="Email address" />
            {errors.email && <p className="text text-center text-danger small">{errors.email.message}</p>}

            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input {...register('password', passwordRules)} type="password" id="inputPassword" className="form-control m-2" placeholder="Password" />
            {errors.password && <p className="text text-center text-danger small">{errors.password.message}</p>}

            <button className="btn btn-lg btn-primary btn-block m-2" type="submit">Sign in</button>

        </form>
     );
}
 
export default SignIn;