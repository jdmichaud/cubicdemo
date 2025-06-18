import numpy as np
import matplotlib.pyplot as plt

# Given points
x_vals = np.array([0, 1/3, 2/3, 1])
y_vals = np.array([0.25, 0.5, 0.1, 0.75])

# Construct the Vandermonde matrix
V = np.vander(x_vals, 4)

# Solve for coefficients a, b, c, d
coefficients = np.linalg.solve(V, y_vals)
a, b, c, d = coefficients

# Define the cubic polynomial
def cubic_poly(x):
    return a * x**3 + b * x**2 + c * x + d

# Plotting
x_plot = np.linspace(0, 1, 500)
y_plot = cubic_poly(x_plot)

plt.figure(figsize=(8, 5))
plt.plot(x_plot, y_plot, label="Cubic Interpolation", color="blue")
plt.scatter(x_vals, y_vals, color="red", label="Given Points")
plt.title("Cubic Polynomial Interpolation Through 4 Points")
plt.xlabel("x")
plt.ylabel("y")
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.show()

# Print the coefficients
print("Cubic polynomial coefficients [a, b, c, d]:")
print(coefficients)
