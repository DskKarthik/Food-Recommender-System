from tensorflow import keras
import numpy as np

def recommend_user_specific(user_id, no_of_recipes=10, model='Matrix Factorization'):
    if model == 'Matrix Factorization':
        model = keras.models.load_model('recommenders/mf_model.h5')

        dish_embedding_learnt = model.get_layer(name='recipe-embedding').get_weights()[0]
        user_embedding_learnt = model.get_layer(name='user-embedding').get_weights()[0]

        return recommend(user_id, dish_embedding_learnt, user_embedding_learnt, no_of_recipes)

def recommend(user_id, dish_embedding_learnt, user_embedding_learnt, number_of_recipes=10):
    dishes = user_embedding_learnt[user_id]@dish_embedding_learnt.T
    dish_ids = np.argpartition(dishes, -number_of_recipes)[-number_of_recipes:]
    return [ int(i) for i in dish_ids]

# print(recommend_user_specific(54500, 10))

