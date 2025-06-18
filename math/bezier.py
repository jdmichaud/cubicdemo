import numpy as np
import matplotlib.pyplot as plt

# Control points
Px = np.array([0, 1/3, 2/3, 1])
Py = np.array([0.25, 0.5, 0.1, 0.75])

# Bezier basis matrix
M_bezier = np.array([
    [-1,  3, -3, 1],
    [ 3, -6,  3, 0],
    [-3,  3,  0, 0],
    [ 1,  0,  0, 0]
])

# Function to evaluate Bezier curve
def bezier_matrix_form(t_vals, P):
    T = np.vstack([t_vals**3, t_vals**2, t_vals, np.ones_like(t_vals)]).T
    return T @ M_bezier @ P

# Parameter t from 0 to 1
t = np.linspace(0, 1, 500)

# Compute Bezier curve points
x_curve = bezier_matrix_form(t, Px)
y_curve = bezier_matrix_form(t, Py)

# Plotting
plt.figure(figsize=(8, 5))
plt.plot(x_curve, y_curve, label='Bezier Curve', color='blue')
plt.plot(Px, Py, 'ro--', label='Control Points')
plt.title('Cubic Bézier Curve using Matrix Form')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
