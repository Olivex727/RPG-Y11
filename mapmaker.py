# Random Map File Generator
# by Peter Howse
# Bugs email: p.howse@tsc.nsw.edu.au
#
# Outputs a map file in the folder where the script
# is run. File format:
# x|y|terrain type|passable terrain boolean|item
# 
# If you re-run the script, you will need to delete the
# old file first, otherwise it just keeps adding to the
# end of the file

import random

# Define the type of terrain available and whether it is
# passable or not.
# NOTE: the first terrain type is the most common
terrain = [
    ["grass", True],
    ["mountain", True],
    ["water", False],
    ["lava", False],
    ["forest", True]
    ]

# Define the items of interest for your map
interest = ["fountain", "dungeon", "monster", "teleport"]

# Dimensions of the map
x = int(input("How many squares across? "))
y = int(input("How many squares down? "))

# How much of the primary terrain do you want?
grass = int(input("How much grassland (1: Some, 2: Many, 3: Lots)? "))

# How many special items of interest do you want?
intlevel = int(input("How interesting do you want the map 1: A little, 2: A bit, 3: Very)"))

# This function determines what is on any particular
# square of the map
def make_terrain(thegrass, theinterest):
    t_pct = [40,60,80]      # modify to adjust liklihood of primary terrain
    i_pct = [5,10,15,20]    # modify to adjust liklihood of items

    # Terrain definitions
    x = random.randint(1,100)
    if x <= t_pct[thegrass]:
        mapTerrain = "grass"
        mapPass = True
    else:
        x = random.randint(1,len(terrain)-1)
        mapTerrain = terrain[x][0]
        mapPass = terrain[x][1]

    # Items
    x = random.randint(1,100)
    if x <= i_pct[theinterest]:
        x = random.randint(0, len(interest)-1)
        mapInterest = interest[x]
    else:
        mapInterest = "none"

    # Returns a list of terrain, passable and items
    return mapTerrain, mapPass, mapInterest

# For each square across then down.
for xx in range(x):
    for yy in range(y):
        maptext = ""
        t = make_terrain(grass-1, intlevel-1)
        maptext = str(xx)+"|"+str(yy)+"|"+t[0]+"|"+str(t[1])+"|"+t[2]+"\n"
        #print (maptext) # uncomment to debug
        
        with open("maptest.txt", "a") as myfile:
            myfile.write(maptext)
