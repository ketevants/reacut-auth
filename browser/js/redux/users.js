import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

const INITIALIZE = 'INITIALIZE_USERS';
const CREATE     = 'CREATE_USER';
export const REMOVE = 'REMOVE_USER';
const UPDATE     = 'UPDATE_USER';
const SET_USER = 'SET_USER';
const REM_USER = 'REM_USER';


/* ------------   ACTION CREATORS     ------------------ */

const init  = users => ({ type: INITIALIZE, users });
const create = user  => ({ type: CREATE, user });
const remove = id    => ({ type: REMOVE, id });
const update = user  => ({ type: UPDATE, user });
const setUser = user  => {
  console.log(user,' iuser')
  return({ type: SET_USER, user })
  };
const logoutUser = ()  => ({ type: REM_USER, user: "" });


/* ------------       REDUCER     ------------------ */

export default function reducer (users = [], action) {
 console.log('action',action)

  switch (action.type) {

    case INITIALIZE:
      return action.users;

    case CREATE:
      return [action.user, ...users];

   case SET_USER:
      return action.user;

    case REM_USER:
      console.log("REM USER *****")
      return action.user;

    case REMOVE:
      return users.filter(user => user.id !== action.id);

    case UPDATE:
      return users.map(user => (
        action.user.id === user.id ? action.user : user
      ));

    default:
      return users;
  }
}


/* ------------       DISPATCHERS     ------------------ */

export const fetchUsers = () => dispatch => {
  axios.get('/api/users')
       .then(res => dispatch(init(res.data)));
};

// optimistic
export const removeUser = id => dispatch => {
  dispatch(remove(id));
  axios.delete(`/api/users/${id}`)
       .catch(err => console.error(`Removing user: ${id} unsuccesful`, err));
};

export const addUser = user => dispatch => {
  axios.post('/api/users', user)
       .then(res => dispatch(create(res.data)))
       .catch(err => console.error(`Creating user: ${user} unsuccesful`, err));
};

export const updateUser = (id, user) => dispatch => {
  axios.put(`/api/users/${id}`, user)
       .then(res => dispatch(update(res.data)))
       .catch(err => console.error(`Updating user: ${user} unsuccesful`, err));
};
export const doLogin = credentials => dispatch => {
  return axios.post('/login', credentials)
       .then(res => res.data)
       .then(user => dispatch(setUser(user)))
       .catch(err => console.error("Unsuccessful", err));
};

export const signUp = credentials => dispatch => {
  return axios.post('/signup', credentials)
       .then(res => res.data)
       .then(user => dispatch(create(user)))
       .catch(err => console.error("Unsuccessful", err));
};


export const loggingOut = () => dispatch => {
        dispatch(logoutUser())
        axios.delete('/logout')
       .catch(err => console.error("Unsuccessful", err));
};
