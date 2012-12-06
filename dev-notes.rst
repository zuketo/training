=======================
MongoDB Developer Notes
=======================

Inserting Documents
-------------------

Any valid JSON document can be inserted into MongoDB.  http://www.json.org/

::

	db.blog.insert({ 
		"headline" : "Apple Reports Fourth Quarter Earnings",
		"slug" : "/apple-reports-fourth-quarter-earnings",
		"description" : "Apple reported fourth quarter earnings today, Wall Street reacted positively." 
	})


Inserting array elements within document
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.blog.insert({ 
		"headline" : "Apple Reports Fourth Quarter Earnings",
		"slug" : "/apple-reports-fourth-quarter-earnings",
		"description" : "Apple reported fourth quarter earnings today, Wall Street reacted positively.",
		"tags" : [ "AAPL", "Earnings", "Business" ]
	})


Inserting sub documents
^^^^^^^^^^^^^^^^^^^^^^^

::

	db.blog.insert({ 
		"headline" : "Apple Reports Fourth Quarter Earnings",
		"slug" : "/apple-reports-fourth-quarter-earnings",
		"description" : "Apple reported fourth quarter earnings today, Wall Street reacted positively.",
		"tags" : [ "AAPL", "Earnings", "Business" ],
		"author" : {
			"name" : "Jason Zucchetto",
			"title" : "Lead Editor"
		} 
	})


Using Javascript in shell to insert 1000 documents
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	for ( i = 0; i < 1000; i++ ) {
		db.blog.insert({ 
			"headline" : "Story " + i
		})
	}

Basic Document Queries
----------------------

Basic query by example
^^^^^^^^^^^^^^^^^^^^^^

::
	
	db.blog.find({ "slug" : "/apple-reports-fourth-quarter-earnings" })


Querying sub document fields (dot notation)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::
	
	db.blog.find({ "author.name" : "Jason Zucchetto" })


Querying array elements
^^^^^^^^^^^^^^^^^^^^^^^

::
	
	db.blog.find({ "tags" : "AAPL" })


Using Query Operators
---------------------

::

	db.people.insert({ "name" : "Bart", "age" : 10})
	db.people.insert({ "name" : "Lisa", "age" : 8})
	db.people.insert({ "name" : "Homer", "age" : 42})
	db.people.insert({ "name" : "Marge", "age" : 40})
	db.people.insert({ "name" : "Blinky"})


$gt (greater than)
^^^^^^^^^^^^^^^^^^

::

	db.people.find({ "age" : { $gt : 8 }})	

$gte (greater than or equal to)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.find({ "age" : { $gte : 10 }})	

$lt (less than)
^^^^^^^^^^^^^^^

::

	db.people.find({ "age" : { $lt : 10 }})	

$lte (less than or equal to)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.find({ "age" : { $lte : 10 }})	

$ne (not equal)
^^^^^^^^^^^^^^^

::

	db.people.find({ "age" : { $ne : 10 }})	

$in (in list or values)
^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.find({ "age" : { $in : [5, 10] }})	

$nin (not in list or values)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.find({ "age" : { $nin : [5, 10] }})	

$mod (age mod 5 = 0)
^^^^^^^^^^^^^^^^^^^^

::

	db.people.find({ "age" : { $mod : [8, 0] }})	

$regex (regular expression)
^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.find({ "name" : { $regex : "j.*" }})	

$exists (field exists in document)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.find({ "description" : { $exists : true }})	


$type (field type, string, integer, etc.)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

http://docs.mongodb.org/manual/reference/operator/type/

::

	db.people.find({ "age" : { $type : 2 }})	


$not 
^^^^

::

	db.people.find({ "age" : { $not : { $gt : 5 } }})	


$or 
^^^

::

	db.people.find({ $or : [{ "name" : "Bart" }, { "name" : "Lisa" }]})	

$nor (not or)
^^^^^^^^^^^^^

::

	db.people.find({ $nor : [{ "name" : "Bart" }, { "name" : "Lisa" }]})	


$elemMatch
^^^^^^^^^^

Insert some sample data

::

	db.parents.insert({ 
		"name" : "Bart", 
		"age" : 8, 
		"parents" : { 
			"father" : "Homer", 
			"mother" : "Marge",
			"residence" : "Springfield"
		} })
	db.parents.insert({ 
		"name" : "Todd", 
		"age" : 8, 
		"parents" : { 
			"father" : "Ned", 
			"mother" : "Maude Flanders", 
			"residence" : "Springfield"
		} })

::

	db.parents.find({ "parents" : { $elemMatch : { "residence" : "Springfield", "father" : "Homer" } } })	


$where (avoid)
^^^^^^^^^^^^^^

::

	db.parents.find({ $where : "this.name == 'Bart'" })	



Querying Arrays
---------------

::

	db.places.insert({ 
		"name" : "Moe's Tavern", 
		"tags" : ["Bar", "Beer", "Springfield"]
		})
	db.places.insert({ 
		"name" : "Quickie Mart", 
		"tags" : ["Store", "Slushee", "Springfield"]
		})


$all 
^^^^

::

	db.places.find({ "tags" : { $all : ["Springfield", "bar"] }})	

$size 
^^^^^

::

	db.places.find({ "tags" : { $size : 3 }})	

$slice (return N elements)
^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.places.find({}, { "tags" : { $slice : 3 }})	


Updating Documents
------------------

Update first document
^^^^^^^^^^^^^^^^^^^^^

::

	db.people.update({ "name" : "Lisa" }, { $set : { "instrument" : "Saxophone"}})

Update all documents
^^^^^^^^^^^^^^^^^^^^

::

	db.people.update({ "name" : { $in : ["Bart", "Lisa"] } }, { $set : { "city" : "Springfield"} }, { multi : true})

Upserts (insert if document not found)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.update({ "name" : { $in : ["Bart", "Lisa"] } }, { $set : { "city" : "Springfield"} }, { upsert : true})


$inc (incrementing a counter)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.update({ "name" : "Lisa" }, { $set : { "friends" : 10}})


::

	db.people.update({ "name" : "Lisa" }, { $inc : { "friends" : 1 }})


$ positional operator
^^^^^^^^^^^^^^^^^^^^^

::

	db.schools.insert({ 
		"name" : "Springfield Elementary", 
		"staff" : [
			{
				"firstname" : "Seymour",
				"lastname" : "Skinner",
				"position" : "Principal"
			}, 
			{
				"firstname" : "Edna",
				"lastname" : "Quabopple",
				"position" : "Teacher"
			} 
		]})


::

	db.schools.update({ "staff.firstname" : "Edna"}, { $set : { "staff.$.position" : "5th grade teacher" }})

$rename (rename a field within a document)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.update({ "name" : "Bart" }, { $rename : { "age" : "my_new_age" }});


Updating Arrays in Documents
----------------------------

Dot notation for array elements
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.places.update({ "name" : "Quickie Mart" }, { $set: { "tags.0" : "SLUSHEE" }})


$push (add value to array)
^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.places.update({ "name" : "Quickie Mart" }, { $push: { tags : "Toothpaste" }})


$pushAll (add multiple values to array)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.places.update({ "name" : "Quickie Mart" }, { $pushAll: { tags : ["Milk", "Eggs"] }})
	


$pull (remove value from array)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.places.update({ "name" : "Quickie Mart" }, { $pull: { tags : "Toothpaste" }})
	

$pullAll (remove all values from array)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.places.update({ "name" : "Quickie Mart" }, { $pullAll: { tags : ["Milk", "Eggs"] }})
	


$pop (remove element from beginning or end of array)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.places.update({ "name" : "Quickie Mart" }, { $pop: { tags : 1 }})
	
::

	db.places.update({ "name" : "Quickie Mart" }, { $pop: { tags : -1 }})
	


$addToSet (add only if value is not already in array)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.places.update({ "name" : "Quickie Mart" }, { $addToSet: { tags : "Toothpaste" }})

::

	db.places.update({ "name" : "Quickie Mart" }, { $addToSet: { tags : "Candy" }})


Removing Documents
------------------

::
	
	db.places.remove({ "name" : "Moe's Tavern" })


Just remove one object
^^^^^^^^^^^^^^^^^^^^^^

::
	
	db.places.remove({ "name" : "Moe's Tavern" }, 1)


Creating an Index
-----------------

Create index on single field
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.ensureIndex({ name : 1})


Create compound index
^^^^^^^^^^^^^^^^^^^^^

::

	db.people.ensureIndex({ name : 1, age : 1})

Create unique index
^^^^^^^^^^^^^^^^^^^

::

	db.people.ensureIndex({ instrument : 1}, {unique : true})

::

	db.people.ensureIndex({ instrument : 1}, {unique : true, dropDups: true })

Create sparse index
^^^^^^^^^^^^^^^^^^^

::

	db.people.ensureIndex({ city : 1}, {sparse : true, background: true})


Create background index
^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.ensureIndex({ city : 1}, {background: true})


TTL index (delete document after a certain amount of time)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	db.people.ensureIndex({ date_created : 1}, { expireAfterSeconds: 3600 })	

Geospatial index
^^^^^^^^^^^^^^^^

::

	db.locations.ensureIndex( { lat_long : "2d" } )


::

	db.locations.insert({name : "Palo Alto", lat_long : [37.441883,-122.143019]})
	db.locations.insert({name : "Cupertino", lat_long : [37.322998,-122.032182]})
	db.locations.insert({name : "San Jose", lat_long : [37.339386,-121.894955]})
	db.locations.insert({name : "San Francisco", lat_long : [37.77493,-122.419415]})
	db.locations.insert({name : "Los Angeles", lat_long : [34.052234,-118.243685]})
	db.locations.insert({name : "Washington, DC", lat_long : [38.895112,-77.036366]})

::

	// find closest locations
	db.places.find({lat_long: {$near : [37.441883,-122.143019] }}) 

::
	
	// points within 6 degrees (~69 miles per degree)
	db.places.find({lat_long: {$near : [37.322998,-122.032182], $maxDistance: 6 }}) 

::

	// within a radius of a point
	db.places.find({"lat_long" : {"$within" : {"$center" : [[37.322998,-122.032182], 5]}}}) 

