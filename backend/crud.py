"""CRUD helpers can be expanded as the API grows.

The current assessment implementation keeps most route logic in main.py so the
business rules for orders are easy to review in one place.
"""

LOW_STOCK_THRESHOLD = 5
VALID_ORDER_STATUSES = {"pending", "confirmed", "shipped", "delivered", "cancelled"}
