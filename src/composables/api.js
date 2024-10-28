import { ofetch } from "ofetch";

export function useAPI() {
  const apiFetch = ofetch.create({ baseURL: '/api'});
  // TODO: USE FETCHERROR to inspect error code

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
        if ('ctx' in err) errors[field].push(err['ctx']['reason'])
        else errors[field].push(err['msg'])
      }

      return {"errors": errors}
    }
  }

  const login = async (email, password) => {
    const fd = new FormData()
    fd.append("email", email);
    fd.append("password", password);

    const response = await apiFetch("/api/users/login", {
      method: "POST",
      body: fd,
    }).catch(error => handleError(error));

    console.log(response);
    return response;
  }

  return { login }
}
