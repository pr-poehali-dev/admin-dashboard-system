import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Materials management - list, create, delete materials, get categories and colors
    Args: event with httpMethod GET/POST and path parameters
    Returns: HTTP response with materials data or success/error message
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
            cursor.execute("""
                SELECT m.id, m.name, mc.name as category_name, c.name as color_name, 
                       c.hex_code, m.auto_deduct, m.manual_deduct, m.defect, m.image_url
                FROM materials m
                LEFT JOIN material_categories mc ON m.category_id = mc.id
                LEFT JOIN colors c ON m.color_id = c.id
                ORDER BY m.id DESC
            """)
            rows = cursor.fetchall()
            materials = [
                {
                    'id': row[0],
                    'name': row[1],
                    'category_name': row[2] or '',
                    'color_name': row[3] or '',
                    'color_hex': row[4] or '#000000',
                    'auto_deduct': row[5],
                    'manual_deduct': row[6],
                    'defect': row[7],
                    'image_url': row[8]
                }
                for row in rows
            ]
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'materials': materials}),
                'isBase64Encoded': False
            }
        
        elif method == 'GET' and 'categories' in path:
            cursor.execute("SELECT id, name FROM material_categories ORDER BY name")
            rows = cursor.fetchall()
            categories = [{'id': row[0], 'name': row[1]} for row in rows]
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'categories': categories}),
                'isBase64Encoded': False
            }
        
        elif method == 'GET' and 'colors' in path:
            cursor.execute("SELECT id, name, hex_code FROM colors ORDER BY name")
            rows = cursor.fetchall()
            colors = [{'id': row[0], 'name': row[1], 'hex_code': row[2]} for row in rows]
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'colors': colors}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and 'create' in path:
            body_data = json.loads(event.get('body', '{}'))
            cursor.execute(
                """INSERT INTO materials (name, category_id, color_id, auto_deduct, manual_deduct, defect, image_url) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                (
                    body_data['name'],
                    int(body_data['category_id']) if body_data.get('category_id') else None,
                    int(body_data['color_id']) if body_data.get('color_id') else None,
                    body_data.get('auto_deduct', False),
                    body_data.get('manual_deduct', False),
                    body_data.get('defect', False),
                    body_data.get('image_url', '')
                )
            )
            material_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': material_id}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST' and 'delete' in path:
            body_data = json.loads(event.get('body', '{}'))
            cursor.execute("DELETE FROM materials WHERE id = %s", (body_data['id'],))
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
