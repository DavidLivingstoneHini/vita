import json
import psycopg2

# Database connection settings
DB_HOST = 'localhost'
DB_PORT = 5433
DB_NAME = 'oziza_app'
DB_USER = 'postgres'
DB_PASSWORD = 'developer123'

# Load DO data from JSON file
with open('../data/doid.json', 'r', encoding='utf-8') as f:
    do_data = json.load(f)

# Establish database connection
conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    database=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD
)
cur = conn.cursor()

# Import DO terms
for term in do_data['terms']:
    cur.execute("""
        INSERT INTO do_terms (do_id, name, definition)
        VALUES (%s, %s, %s)
    """, (term['id'], term['name'], term['definition']))

# Import DO relationships
for relationship in do_data['relationships']:
    cur.execute("""
        INSERT INTO do_relationships (do_term_id, relationship_type, related_do_term_id)
        VALUES (%s, %s, %s)
    """, (relationship['subject']['id'], relationship['predicate'], relationship['object']['id']))

# Commit changes and close connection
conn.commit()
cur.close()
conn.close()
