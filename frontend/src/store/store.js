import { createContext, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/",
});

// import api from "./axios/api";
export const GlobalStoreContext = createContext({});

const data = require("../assets/lab2Data.json");

function GlobalStoreContextProvider(props) {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE

  // fill in with store variables
  const [store, setStore] = useState({
    k: 3,
    di: 4,
    scatterplot_matrix_data: data.scatterplot_matrix_data,
    pca_scatterplot_data: data.pca_scatterplot_data,
    sum_of_squares_loading: data.sum_squares_loading,
    pca_scatterplot_vectors: data.top_attribute_vectors,
  });
  const [loading, setLoading] = useState(false);
  store.setK = function (new_k) {
    setLoading(true);
    async function fetchData() {
      const response = await api.get(`/k/${new_k}/di/${store.di}`);
      let new_data = response.data;
      setStore({
        k: new_k,
        di: store.di,
        scatterplot_matrix_data: new_data.scatterplot_matrix_data,
        pca_scatterplot_data: new_data.pca_scatterplot_data,
        sum_of_squares_loading: new_data.sum_squares_loading,
        pca_scatterplot_vectors: new_data.top_attribute_vectors,
      });
      setLoading(false);
    }
    fetchData();
    // this.updateData();
  };

  store.setDi = function (new_di) {
    setLoading(true);
    async function fetchData() {
      const response = await api.get(`/k/${store.k}/di/${new_di}`);
      let new_data = response.data;
      setStore({
        k: store.k,
        di: new_di,
        scatterplot_matrix_data: new_data.scatterplot_matrix_data,
        pca_scatterplot_data: new_data.pca_scatterplot_data,
        sum_of_squares_loading: new_data.sum_squares_loading,
        pca_scatterplot_vectors: new_data.top_attribute_vectors,
      });
      setLoading(false);
    }
    fetchData();
    // this.updateData();
  };

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
        loading,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}
export default GlobalStoreContext;
export { GlobalStoreContextProvider };
