# from django.http import HttpResponse
from django.http import JsonResponse


import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

import matplotlib.pyplot as plt

import json
from sklearn.preprocessing import MinMaxScaler


def getLab2Data( k=3, di=4):
    data = pd.read_csv("C:/Users/fahee/Documents/SBU/8-Spring 2024/CSE 564/cse564-project/backend/backend/billionares.csv")
    data['category']=data['category'].astype('category')
    data['industries']=data['industries'].astype('category')

    cat_columns = data.select_dtypes(['category']).columns
    data[cat_columns] = data[cat_columns].apply(lambda x: x.cat.codes)
    data = data.select_dtypes(include=[np.number])

    # data = data[['Severity', 'Distance', 'Temperature', 'Humidity', 'Pressure', 'Visibility', 'WindSpeed', 'Precipitation']]
    data.drop([ 'latitude_country', 'longitude_country','rank','finalWorth','population_country','gdp_country'], axis=1, inplace=True)
    data = data.fillna(data.median())

    output = {}

    pca = PCA(n_components=di)
    pca.fit(data)
    
    transformed_data = pca.transform(data)
    loadings = pca.components_
    loadings_sum = np.sum(loadings**2, axis=0)
    top_attributes = np.argsort(loadings_sum)[-4:]

    sum_square_loadings = [{'name': data.columns[attribute], 'value': loadings_sum[attribute]} for attribute in top_attributes[::-1]]


    output['sum_squares_loading'] = sum_square_loadings

    kmeans = KMeans(n_clusters=k)
    kmeans.fit(transformed_data)

    # Get the cluster labels
    cluster_labels = kmeans.labels_

    scatterplot_matrix_data = data[data.columns[top_attributes]]
    scatterplot_matrix_data['clusterId'] = cluster_labels

    output['scatterplot_matrix_data'] = scatterplot_matrix_data.to_dict('records')

    pca_scatterplot_data = transformed_data[:, :2]

# Create an instance of MinMaxScaler
    scaler = MinMaxScaler(feature_range=(-1, 1))

    pca_scatterplot_data = scaler.fit_transform(pca_scatterplot_data)


    pca_scatterplot_data = pd.DataFrame(pca_scatterplot_data, columns=['x', 'y'])
    pca_scatterplot_data['clusterId'] = cluster_labels

    output['pca_scatterplot_data'] = pca_scatterplot_data.to_dict('records')

    top_attribute_vectors = loadings[:, top_attributes]

    output['top_attribute_vectors'] = [{'x': top_attribute_vectors[0][i], 'y': top_attribute_vectors[1][i], 'name': data.columns[top_attributes[i]]} for i in range(len(top_attributes))][::-1]
        
    return output



def index(request, k, di):
    print(k, di)
    output = getLab2Data(k, di)
    # return HttpResponse("Hello, world")
    return JsonResponse(output)