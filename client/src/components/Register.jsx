import '../css/signin.css';
import { useForm } from 'react-hook-form';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Register = ({ updateMessage }) => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Send new user info to api
    const sendNewUser = info => {
        authService.register(info, (isSuccessful, reason) => {
            if (isSuccessful){
                        navigate('/') ;
                        updateMessage({ content: reason, type: 'success' });


            } else {
                navigate('/register');
                updateMessage({ content: reason, type: 'danger' });
            }
        })
    };

    // Validation rules
    const firstRules = {
        required: 'First name is required',
    };

    const lastRules = {
        required: 'Last name is required.',
    };

    const emailRules = {
        required: 'Email is required',
        pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Must be valid email format",
        }
    };

    const passwordRules = {
        required: 'Password is required.',
        minLength: {
            value: 6,
            message: 'Password must have at least 6 characters.'
        }
    };

    return (
        <form onSubmit={handleSubmit(sendNewUser)} className="form-signin">
            <h1 className="h3 mb-3 font-weight-normal text-center">Register</h1>

            {/* First Name */}
            <label htmlFor="inputFName" className="sr-only">
                First Name
            </label>
            <input
                {...register('firstName', firstRules)}
                id="inputFName"
                className="form-control"
                placeholder="First Name"
            />
            {errors.firstName && <p className="text text-center text-danger small">{errors.firstName.message}</p>}

            {/* Last Name */}
            <label htmlFor="inputLName" className="sr-only">
                Last Name
            </label>
            <input
                {...register('lastName', lastRules)}
                id="inputLName"
                className="form-control"
                placeholder="Last Name"
            />
            {errors.lastName && <p className="text text-center text-danger small">{errors.lastName.message}</p>}

            {/* Email */}
            <label htmlFor="inputEmail" className="sr-only">
                Email address
            </label>
            <input
                {...register('email', emailRules)}
                id="inputEmail"
                className="form-control"
                placeholder="Email address"
            />
            {errors.email && <p className="text text-center text-danger small">{errors.email.message}</p>}

            {/* Password */}
            <label htmlFor="inputPassword" className="sr-only">
                Password
            </label>
            <input
                {...register('password', passwordRules)}
                type="password"
                id="inputPassword"
                className="form-control"
                placeholder="Password"
            />
            {errors.password && <p className="text text-center text-danger small">{errors.password.message}</p>}

            {/* Submit Button */}
            <button className="btn btn-lg btn-primary btn-block" type="submit">
                Sign in
            </button>
        </form>
    );
};

export default Register;
