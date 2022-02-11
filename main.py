from flask import Flask, request
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse
from flask_jwt import JWT, jwt_required
import db_mongo
import orders_util

app = Flask(__name__)
api = Api(app)
CORS(app)

class Order(Resource):

    order_parser = reqparse.RequestParser()
    order_parser.add_argument(
        'rest_ID',
        required="True",
        help = "Restaurant not specified..."
    )

    order_parser.add_argument(
        'dish_ID',
        required="True",
        help = "Dish not specified..."
    )

    order_parser.add_argument(
        'username',
        required="True",
        help = "Username not specified..."
    )

    order_details = reqparse.RequestParser()
    order_details.add_argument(
        'username',
        required="True",
        help = "Username Not Provided"
    )

    order_details.add_argument(
        'date',
        required="True",
        help = "Date Not Provided"
    )
    order_details.add_argument(
        'time'
    )

    order_details.add_argument(
        'bill',
        required="True",
        help = "Bill Not Provided"
    )

    def get(self, rest_ID, dish_ID):
        
        for order in orders_util.dskk_orders:
            if order['order1']['rest_ID'] == rest_ID and order['order1']['dish_ID'] == dish_ID:
                return order['order1']

    def post(self, rest_ID, dish_ID):
        data = Order.order_details.parse_args()
        print(data)
        username = data['username']
        date = data['date']
        time = data['time']
        bill = data['bill']
        orders_util.update_order(rest_ID, dish_ID, username,time, date, bill)
        return {"Message": "Order Updated Sucsesfully"}

    def put(self):
        pass

    def delete(self):
        pass

class User_Orders(Resource):

    def get(self,  username):
        orders = orders_util.get_user_orders(username)
        return orders

class Test(Resource):

    productArray = [
    {
      "name": "Dish 1",
      "restId": 101,
      "dishId": 20,
      "actual cost": "200",
      "discounted price": "150",
      "rating": 5
    },

    {
      "name": "Dish 2",
      "restId": 102,
      "dishId": 21,
      "actual cost": "400",
      "discounted price": "375",
      "rating": 4
    },

    {
      "name": "Dish 3",
      "restId": 102,
      "dishId": 25,
      "actual cost": "300",
      "discounted price": "200",
      "rating": 3
    },

    {
      "name": "Dish 4",
      "actual cost": "450",
      "restId": 105,
      "dishId": 40,
      "discounted price": "300",
      "rating": 4
    }
  ]

    productArray2 = [
    {
      "name": "Popular Dish 1",
      "actual cost": "200",
      "discounted price": "150",
      "rating": 5
    },

    {
      "name": "Polular Dish 2",
      "actual cost": "400",
      "discounted price": "375",
      "rating": 4
    },

    {
      "name": "Popular Dish 3",
      "actual cost": "300",
      "discounted price": "200",
      "rating": 3
    },

    {
      "name": "Popular Dish 4",
      "actual cost": "450",
      "discounted price": "300",
      "rating": 4
    }
    ] 

    def get(self):
        return {
            "productArray": self.productArray,
            "productArray2": self.productArray2
        }


class GetRestList(Resource):

	def get(self):
		city  = request.args.get('city')
		rest_list = db_mongo.getRestaurants(city)
		#print(rest_list)
		return {"Restaurant details": rest_list}

class GetDishes(Resource):

	def get(self, restId):
		dishList = db_mongo.getDishes(restId)
		print(dishList)
		return dishList

class GetDishDetails(Resource):

	def get(self, dishId):
		details = db_mongo.getDishDetails(dishId)
		return details
  
class UserAdminLogin(Resource):

  def post(self):

    data = request.get_json()
    username = data['userName']
    password = data['password']

    result = db_mongo.login(username, password)
    return result


class UpdateOrder(Resource):

	def post(self):
		data = dict(request.get_json())
		# print(data)
		# orderData = list(data['orderDetails'].values())
		# orderDishes = data['orderDishes']
		
		db_mongo.updateOrder(data)

		return {"Message": "Order Updated Sucsessfully!"}


class GetOrders(Resource):

	def get(self, user_id):
		orders = db_mongo.getUserOrders(user_id)
		return orders
  
class GetLatestOrderId(Resource):

  def get(self, user_id):
    return db_mongo.getLatestOrderId(user_id)


class UpdateOrderStatus(Resource):

  def post(self):
    data = request.get_json()
    orderId = data['orderId']
    status = data['status']
    return db_mongo.updateOrderStatus(orderId, status)

class UpdateDishOrderRating(Resource):

  def post(self):
    data = request.get_json()
    orderId = data['_id']
    # restId = data['restaurant_id']
    # dishId = data['dish_id']
    rating = data['rating']

    return db_mongo.updateRating(orderId, rating)


class GetUserRecommendations(Resource):

  def get(self, user_id):
    return db_mongo.getDishRecommendations(user_id)
  
class GetUserStats(Resource):

  def get(self, user_id):
    return db_mongo.getUserStats(user_id)

api.add_resource(Order, '/order/<string:rest_ID>/<string:dish_ID>')
api.add_resource(User_Orders, '/<string:username>/orders')
api.add_resource(Test, '/getProductArray')
api.add_resource(GetRestList, '/getRestaurants')
api.add_resource(GetDishes, '/getDishes/<int:restId>')
api.add_resource(GetDishDetails, '/item-details/<int:dishId>')
api.add_resource(UserAdminLogin, '/verifyUser')
api.add_resource(UpdateOrder, '/updateOrder')
api.add_resource(GetOrders, '/getOrders/<int:user_id>')
api.add_resource(GetLatestOrderId,  '/getLatestOrderId/<int:user_id>')
api.add_resource(UpdateOrderStatus, '/updateOrderStatus')
api.add_resource(UpdateDishOrderRating, '/updateRating')
api.add_resource(GetUserRecommendations, '/userRecommendations/<int:user_id>')
api.add_resource(GetUserStats, '/getUserStats/<int:user_id>')

if __name__ == "__main__":
    app.run(debug=True)