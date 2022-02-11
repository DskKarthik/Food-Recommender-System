import pymongo
# from pymongo.common import SERVER_SELECTION_TIMEOUT
# from bson.objectid import ObjectId
# import pandas as pd
# import json
# import recommender
import healthFilter
# from recommender import recommend
from collections import Counter

def initializeMongoClinet():
    try:
        client = pymongo.MongoClient(host="localhost", port = 27017)
    except:
        print("Cannot connect to MongoDB")
    
    return client

def getUserOrders(user_id):

    client = initializeMongoClinet()

    db = client.frs
    orders = db.order_data

    user_orders = orders.find({'user_id' : user_id})
    for order in user_orders:
        print(order)

# def getUserData(user_id):
#     client = initializeMongoClinet()

#     db = client.frs
#     users = db.user_data

#     user = users.find_one({'_id':user_id})
#     print(user)
#     return user

def login(email, password):
    client = initializeMongoClinet()

    db = client.frs
    users = db.user_data

    userData = users.find_one({'Email':email, 'Password': password})
    if userData:
        userData['privelege'] = 'U'
        return  userData
    else:
        return {'Message' : 'Invalid Credentials'}

def getRestaurants(city):
    client = initializeMongoClinet()

    db = client.frs
    restaurants = db.restaurant
    return list(restaurants.find({'city':city}))

def getDishes(rest_id):
    client = initializeMongoClinet()

    db = client.frs
    dishes = db.dish.find({'Restaurant Id':rest_id})
    return [
                {
                    'dish_id' : i['_id'], 
                    'name': i['name'], 
                    'cost': i['cost'], 
                    'discount_cost':i['discount_cost'],
                    'rating' : i['aver_rate'],
                    'image_url' : i['image_url']
                } for i in dishes
            ]

def getDishDetails(dish_id):
    client = initializeMongoClinet()

    db = client.frs
    dish = db.dish.find_one({'_id' : dish_id})
    rest_id = dish['Restaurant Id']
    dish['restaurant_name'] = db.restaurant.find_one({'_id' : rest_id})['Name']
    dish['ingredients'] = dish['ingredients'].split('^')
    dish.pop('reviews')
    dish.pop('cooking_directions')
    dish.pop('nutritions')
    return dish

def getDishRecommendations(user_id):

    client = initializeMongoClinet()
    db = client.frs

    user_based = None
    health_based = None
    if user_id != 0:
        # dishes = recommender.recommend_user_specific(user_id, 5)
        recommendations = healthFilter.health_userbased(user_id, 6)
    
        user_based = recommendations['user_based']
        health_based = recommendations['health_based']

    popular_list = list(db.dish.find().sort('aver_rate', pymongo.DESCENDING).limit(6))
    trending_list = list(db.dish.find().sort('review_nums', pymongo.DESCENDING).limit(6))

    if user_based:
        user_list = []
        for dish_id in user_based:
            dish = db.dish.find_one({'_id' : dish_id})
            dish.pop('cooking_directions')
            dish.pop('reviews')
            dish.pop('nutritions')
            dish['restName'] = db.restaurant.find_one({'_id' : dish['Restaurant Id']})['Name']
            user_list.append(dish)

    if health_based:
        health_list = []
        for dish_id in health_based:
            dish = db.dish.find_one({'_id' : dish_id})
            dish.pop('cooking_directions')
            dish.pop('reviews')
            dish.pop('nutritions')
            dish['restName'] = db.restaurant.find_one({'_id' : dish['Restaurant Id']})['Name']
            health_list.append(dish)

    for dish in popular_list:
        dish.pop('cooking_directions')
        dish.pop('reviews')
        dish.pop('nutritions')
        dish['restName'] = db.restaurant.find_one({'_id' : dish['Restaurant Id']})['Name']
    
    for dish in trending_list:
        dish.pop('cooking_directions')
        dish.pop('reviews')
        dish.pop('nutritions')
        dish['restName'] = db.restaurant.find_one({'_id' : dish['Restaurant Id']})['Name']

    if user_id != 0:
        return {
            'user_based' : user_list,
            'health_based' : health_list,
            'popular' : popular_list,
            'trending_list' : trending_list
        }
    else:
        return {
            'popular' : popular_list,
            'trending_list' : trending_list
        }

def getUserOrders(user_id):
    client = initializeMongoClinet()
    db = client.frs
    orders = [ dict(i) for i in db.order.find({'user_id' : user_id}) ]
    # print(list(orders))
    for order in orders:
        # print(order)
        order['restName'] = db.restaurant.find_one({'_id':order['restaurant_id']})['Name']
        order['dishName'] = db.dish.find_one({'_id':order['dish_id']})['name']
        order['order_datetime'] = order['order_datetime'].strftime('%m/%d/%Y')

    # print(list(orders))
    return list(orders)

def updateOrder(data):
    client = initializeMongoClinet()
    db = client.frs
    order = db.order
    last_id = list(order.find().sort('_id', pymongo.DESCENDING).limit(1))[0]['_id']
    data['_id'] = last_id + 1
    order.insert_one(data)
    order.update(data, { 
        '$currentDate': {
            'order_datetime': { '$type': 'date' }
        }
    },upsert=True)

def getLatestOrderId(user_id):
    client = initializeMongoClinet()
    db = client.frs
    order = db.order
    last_id = list(order.find({'user_id':user_id}).sort('_id', pymongo.DESCENDING).limit(1))[0]['_id']
    return last_id

def updateRating(order_id, rating):
    client = initializeMongoClinet()
    db = client.frs
    order = db.order
    order.update_one(   
                        {'_id': order_id}, 

                        { 
                            "$set" : {'rating': rating}
                        }
                    )
    return {"Message" : "Updated SUccessfully"}

def updateOrderStatus(order_id, status):
    client = initializeMongoClinet()
    db = client.frs
    order = db.order

    order.update_one(
                        {'_id': order_id}, 

                        {
                            "$set" : {'status': status}
                        }
                    )
    return {"Message" : "Updated SUccessfully"}

def getUserStats(user_id):
    client = initializeMongoClinet()
    db = client.frs
    orders = db.order.find({"user_id": user_id})
    dish_dict = {}
    rest_dict = {}

    no_of_orders = 0
    ratings_count = 0
    for order in orders:
        if order['dish_id'] not in dish_dict.keys():
            dish_dict[order['dish_id']] = 1
        else:
            dish_dict[order['dish_id']] += 1
        
        if order['restaurant_id'] not in rest_dict.keys():
            rest_dict[order['restaurant_id']] = 1
        else:
            rest_dict[order['restaurant_id']] += 1
        
        if order['rating'] > 0:
            ratings_count += 1

        no_of_orders += 1

    print(dish_dict)
    print(rest_dict)


    dish_dict = {k: v for k, v in sorted(dish_dict.items(), key=lambda item: item[1], reverse=True)}    
    rest_dict = {k: v for k, v in sorted(rest_dict.items(), key=lambda item: item[1], reverse=True)}    


    most_ordered_dish_id = list(dish_dict.keys())[0]
    fav_rest_id = list(rest_dict.keys())[0]

    fav_dish = db.dish.find_one({'_id':most_ordered_dish_id})
    fav_dish_name = fav_dish['name']
    rest_id = fav_dish['Restaurant Id']
    fav_dish_rest = db.restaurant.find_one({'_id' : rest_id})['Name']
    
    fav_rest = db.restaurant.find_one({'_id':fav_rest_id})
    fav_rest_name = fav_rest['Name']

    return {
        "no_of_orders" : no_of_orders,
        "fav_dish" : fav_dish_name,
        "fav_dish_rest" : fav_dish_rest,
        "fav_rest" : fav_rest_name,
        "rating_count" : ratings_count
    }

# getUserOrders(54500)
# print(login('FrankPhillips@gmail.com', '0000'))
# print(getDishes(304))
# print(len(getRestaurants('Bangalore')))
print(getUserStats(1))