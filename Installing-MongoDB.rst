=======================
MongoDB Getting Started
=======================

Installing MongoDB
------------------

Downloading MongoDB
~~~~~~~~~~~~~~~~~~~

::

	http://mongodb.org

May want to place binaries in path


Starting MongoDB
~~~~~~~~~~~~~~~~

Create a directory for MongoDB to store data files
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::
	
	mkdir -p /data/db


Start server process
^^^^^^^^^^^^^^^^^^^^

::

	mongod --dbpath /data/db


Start a client to connect to server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::

	mongo


Working with the shell
~~~~~~~~~~~~~~~~~~~~~~

Show databases
^^^^^^^^^^^^^^

::
	
	show dbs

Create new database
^^^^^^^^^^^^^^^^^^^

::
	
	use mynewdatabase


Insert a sample document into new collection
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::
	
	db.mynewcollection.insert({ "hello" : "world" })


Query for sample document
^^^^^^^^^^^^^^^^^^^^^^^^^

::
	
	db.mynewcollection.find()



Other helpful shell commands
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Show all available methods for collection
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::
	
	db.mynewcollection.help()


Show collection stats
^^^^^^^^^^^^^^^^^^^^^

::
	
	db.mynewcollection.stats()


Get BSON document size
^^^^^^^^^^^^^^^^^^^^^^

::
	
	Object.bsonsize({name:"jason"})


Show all available methods for a database
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::
	
	db.help()

Show all available databases
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

::
	
	show dbs






