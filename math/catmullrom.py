import numpy as np
import matplotlib.pyplot as plt

# Catmull-Rom cubic interpolation using matrix form (single segment)
def catmull_rom(p0, p1, p2, p3, t):
    t2 = t * t
    t3 = t2 * t

    T = np.array([t3, t2, t, 1])
    M = np.array([
        [-0.5,  1.5, -1.5,  0.5],
        [ 1.0, -2.5,  2.0, -0.5],
        [-0.5,  0.0,  0.5,  0.0],
        [ 0.0,  1.0,  0.0,  0.0]
    ])

    P = np.array([p0, p1, p2, p3])
    return T @ M @ P

# Define a single segment with 4 y-values
p0, p1, p2, p3 = 0.25, 0.5, 0.1, 0.75

# Evaluate across t in [0, 1]
t_vals = np.linspace(0, 1, 500)
y_vals = [catmull_rom(p0, p1, p2, p3, t) for t in t_vals]

# Plotting
plt.figure(figsize=(8, 5))
plt.plot(t_vals, y_vals, label='Catmull-Rom Segment', color='blue')
plt.plot([0, 1/3, 2/3, 1], [p0, p1, p2, p3], 'ro--', label='Control Points (y only)')
plt.title("Catmull-Rom Spline (Single Segment)")
plt.xlabel("t (0 to 1)")
plt.ylabel("Interpolated y")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()
