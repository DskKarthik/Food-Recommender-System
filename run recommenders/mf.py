import numpy as np
import os
import pandas as pd
from sklearn.utils import shuffle

from keras.models import Model
from keras.layers import Input, Embedding, Dot, Add, Flatten
from keras.regularizers import l2
from keras.optimizers import SGD, Adam

# load in the data
df = pd.read_csv('original_order_data.csv')

N = df.user_id.max() + 1 # number of users
M = df.dish_id.max() + 1 # number of dishes

# split into train and test
df = shuffle(df)
cutoff = int(0.8*len(df))
df_train = df.iloc[:cutoff]
df_test = df.iloc[cutoff:]

# initialize variables
K = 10 # latent dimensionality
mu = df_train.rating.mean()
epochs = 5
reg = 0.0001 # regularization penalty

u = Input(shape=(1,))
r = Input(shape=(1,))
u_embedding = Embedding(N, K, embeddings_regularizer=l2(reg), name = "user-embedding")(u) # (N, 1, K)
r_embedding = Embedding(M, K, embeddings_regularizer=l2(reg), name = "recipe-embedding")(r) # (N, 1, K)


u_bias = Embedding(N, 1, embeddings_regularizer=l2(reg))(u) # (N, 1, 1)
r_bias = Embedding(M, 1, embeddings_regularizer=l2(reg))(r) # (N, 1, 1)
x = Dot(axes=2)([u_embedding, r_embedding]) # (N, 1, 1)

x = Add()([x, u_bias, r_bias])
x = Flatten()(x)

model = Model(inputs=[u, r], outputs=x)
model.compile(
  loss='mse',
  # optimizer='adam',
  # optimizer=Adam(lr=0.01),
  optimizer=SGD(lr=0.08, momentum=0.9),
  metrics=['mse'],
)

r = model.fit(
  x=[df_train.user_index.values, df_train.recipe_index.values],
  y=df_train.rating.values - mu,
  epochs=epochs,
  batch_size=128,
  validation_data=(
    [df_test.user_index.values, df_test.recipe_index.values],
    df_test.rating.values - mu
  )
)

model.save(r'C:\Users\dskk2\OneDrive\Desktop\Sem-7\IWS\Project\project\frs-app\recommenders\mf_model.h5')