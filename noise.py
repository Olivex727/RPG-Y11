import random
import math
import matplotlib.pyplot as plt


mapsize = 20

def adjacent_min(noise):  # same as before
    output = []
    for i in range(len(noise) - 1):
        output.append(int(min(noise[i], noise[i+1])))
    return output

def smoother(noise):
    output = []
    for i in range(len(noise) - 1):
        output.append(0.5 * (noise[i] + noise[i+1]))
    return output

hello = adjacent_min(smoother(smoother(adjacent_min([random.randint(1,5) for i in range(mapsize)]))))
print(hello)
