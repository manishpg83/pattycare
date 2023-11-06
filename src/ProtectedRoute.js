import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setUserLoginDetails } from './user/userSlice';
import { auth } from './firebase';

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        setUser(authUser);
      } else {
        history.push('/'); // Redirect to the login page if the user is not authenticated
      }
    });

    return () => {
      unsubscribe();
    };
  }, [history]);

  const setUser = user => {
    dispatch(
      setUserLoginDetails({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
      })
    );
  };

  return children;
};

export default ProtectedRoute;
