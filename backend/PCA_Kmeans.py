import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

import matplotlib.pyplot as plt

# Load your data into a pandas DataFrame
data = pd.read_csv('billionares.csv')

data = data.select_dtypes(include=[np.number])


data = data.fillna(data.median())


# Perform PCA
pca = PCA()
pca.fit(data)

# Compute the Eigenvalues and visualize them as a scree plot
eigenvalues = pca.explained_variance_
plt.bar(range(1, len(eigenvalues) + 1), eigenvalues)
plt.xlabel('Principal Component')
plt.ylabel('Eigenvalue')
plt.title('Scree Plot')
plt.show()

# Allow the user to select the intrinsic dimensionality index (di)
di = int(input('Enter the intrinsic dimensionality index (di): '))

# Perform PCA with the selected number of components
pca = PCA(n_components=di)
pca.fit(data)
transformed_data = pca.transform(data)

# Plot the data in a PCA-based biplot
plt.scatter(transformed_data[:, 0], transformed_data[:, 1])
plt.xlabel('PC1')
plt.ylabel('PC2')
plt.title('PCA Biplot')
plt.show()

# Get the attributes with the highest squared sum of PCA loadings
loadings = pca.components_
loadings_sum = np.sum(loadings**2, axis=0)
top_attributes = np.argsort(loadings_sum)[-4:]

# Print the top attributes
print('Top attributes:')
for attribute in top_attributes:
    print(data.columns[attribute])

# Construct a scatterplot matrix using the top attributes
scatterplot_data = data.iloc[:, top_attributes]
pd.plotting.scatter_matrix(scatterplot_data)
plt.show()

# Use k-means to find clusters
k_values = range(1, 11)
inertia = []
for k in k_values:
    kmeans = KMeans(n_clusters=k)
    kmeans.fit(data)
    inertia.append(kmeans.inertia_)

# Visualize the elbow method
plt.plot(k_values, inertia)
plt.xlabel('Number of Clusters (k)')
plt.ylabel('Inertia')
plt.title('Elbow Method')
plt.show()