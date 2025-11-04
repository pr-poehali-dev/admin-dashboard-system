import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: User management - list, create, update users
    Args: event with httpMethod GET/POST and path parameters
    Returns: HTTP response with users data or success/error message
    '''
    method: str = event.get('httpMethod', 'GET')
    path: str = event.get('path', '/')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        dsn = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(dsn)
        cursor = conn.cursor()
        
        if method == 'GET' and 'list' in path:
            cursor.execute(
                "SELECT id, login, password, full_name, role, status FROM users ORDER BY id"
            )
            rows = cursor.fetchall()
            users = [
                {
                    'id': row[0],
                    'login': row[1],
                    'password': row[2],
                    'full_name': row[3],
                    'role': row[4],
                    'status': row[5]
                }
                for row in rows
            ]
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'users': users}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and 'create' in path:
            body_data = json.loads(event.get('body', '{}'))
            cursor.execute(
                "INSERT INTO users (login, password, full_name, role, status) VALUES (%s, %s, %s, %s, %s) RETURNING id",
                (body_data['login'], body_data['password'], body_data['full_name'], body_data['role'], body_data['status'])
            )
            user_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': user_id}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and 'update' in path:
            body_data = json.loads(event.get('body', '{}'))
            cursor.execute(
                "UPDATE users SET login = %s, password = %s, full_name = %s, role = %s, status = %s WHERE id = %s",
                (body_data['login'], body_data['password'], body_data['full_name'], body_data['role'], body_data['status'], body_data['id'])
            )
            conn.commit()
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        else:
            cursor.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Endpoint not found'}),
                'isBase64Encoded': False
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
