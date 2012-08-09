import webapp2
import datetime
import urllib
import cgi
import jinja2
import os

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))

from google.appengine.ext import db
from google.appengine.api import users


class Item(db.Model):
  """Models a needed item"""

 
  author       = db.StringProperty()
  name         = db.StringProperty()
  group        = db.StringProperty()
  details      = db.StringProperty(multiline=True)
  created_time = db.DateTimeProperty(auto_now_add=True)


def item_key(item_name=None):
  """Constructs a Datastore key for a Item entity with item_name."""
  return db.Key.from_path('Item', item_name or 'default_item')





class MainPage(webapp2.RequestHandler):
  def get(self):
    
    items_query = Item.all().ancestor(
        item_key("needed_items")).order('name')
    items = items_query.fetch(100)
    
    stocktypes_query = Item.all().ancestor(
        item_key("needed_stocktypes")).order('name')
    stocktypes = stocktypes_query.fetch(100)

#    guestbook_name=self.request.get('guestbook_name')
#    if users.get_current_user():
#        url = users.create_logout_url(self.request.uri)
#        url_linktext = 'Logout'
#    else:
#        url = users.create_login_url(self.request.uri)
#        url_linktext = 'Login'

    template_values = {
        'items': items,
        'stocktypes': stocktypes,
        'stockgroups': 
          [
            "Beverages",
            "Canned food",
            "Condiments",
            "Dairy",
            "Dessert",
            "Dryfoods",
            "Household",
            "Produce",
            "Protein",
            "Spices"
          ]
    }

    template = jinja_environment.get_template('index.html')
    self.response.out.write(template.render(template_values))

class Add(webapp2.RequestHandler):
  def post(self):
    list = self.request.get('list')
    newitem = Item(parent=item_key(list))

    if users.get_current_user():
      newitem.author = users.get_current_user().nickname()

    newitem.name = self.request.get('name') 
    newitem.group = self.request.get('group')
    newitem.put()
    self.response.out.write( newitem.key() )
    #no redirect because this is an ajax request now
    #self.redirect('/')

class Delete(webapp2.RequestHandler):
  def post(self):
    item = Item.get( self.request.get('id') )
    item.delete()


app = webapp2.WSGIApplication([
  ('/', MainPage), 
  ('/delete', Delete),
  ('/add', Add),
 ], debug=True)

