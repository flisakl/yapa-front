import { ofetch } from "ofetch";
import { ref } from 'vue';

export function useAPI() {
  const apiFetch = ofetch.create({ baseURL: '/api', });

  const user = ref({});
  const setUser = (usr) => user.value = usr

  const auth_header = () => {
    return { 'Authorization': `Bearer ${user.value.token}` }
  }

  const handleError = error => {
    /**
    * 4XX errors are treated as field errors
    */
    if (error.statusCode >= 400 && error.statusCode < 500) {
      const errors = {}
      const details = error.data.detail

      for (let err of details) {
        const field = err.loc.at(-1)
        errors[field] ??= []
        if ('ctx' in err) {
          const ctx = err['ctx']
          if ('reason' in ctx) errors[field].push(ctx['reason'])
          else if ('error' in ctx) errors[field].push(ctx['error'])
        }
        else errors[field].push(err['msg'])
      }

      return {"errors": errors}
    }
  }

  const login = async (email, password) => {
    const fd = new FormData()
    fd.append("email", email);
    fd.append("password", password);

    const response = await apiFetch("/users/login", {
      method: "POST",
      body: fd,
    }).catch(error => handleError(error));

    return response;
  }

  const register = async (fname, lname, email, pass1, pass2) => {
    const fd = new FormData()
    fd.append("first_name", fname);
    fd.append("last_name", lname);
    fd.append("email", email);
    fd.append("password1", pass1);
    fd.append("password2", pass2);

    const response = await apiFetch("/users/", {
      method: "POST",
      body: fd,
    }).catch(error => handleError(error));

    return response;
  }

  const uploadAvatar = async (avatar) => {
    const fd = new FormData()
    fd.append("avatar", avatar);

    const response = await apiFetch("/users/avatar", {
      method: "POST",
      body: fd,
      headers: auth_header()
    }).catch(error => handleError(error));

    return response;
  }




  return { login, register, uploadAvatar, setUser }
}
