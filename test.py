import sys
import pygame
import time

l = []
invent = []


class loc:

    interacted = False
    setint = False

    #Intitialisation: Name of object, global x-y position, Colour/Image, Coulor Name/Image File
    def __init__(self, name, x, y, lookops=True, look="giphy.gif", interact=False):  # Add default img
        self.name = name
        self.x = x
        self.y = y
        self.lookops = lookops
        self.look = look
        self.interactable = interact
        #self.size = w, h

    #Interact options: item added/removed to invent, new position, is removed?, Sound effect, other loc to interact, changed look
    def setInteract(self, inventadd="", inventrem="", newx="", newy="", vis="", sfx="", eventcall="", lookcg="", condition=""):
        self.setint = True  # Declare that the object has had it's interactions set
        # Remove or add item to inventory \/ (List of strings)
        self.inventadd = inventadd
        self.inventrem = inventrem
        self.vis = vis  # Will the object be removed if interacted with
        self.newpos = newx, newy  # This affects the player's global position
        self.sfx = sfx  # Sound effect file
        # This activates the interact function of a seperate location
        self.eventcall = eventcall
        self.lookcg = lookcg  # the new image the object will have
        self.condition = condition  # Interactible if another object has been interacted with

#interact function - interacts with object based on source (STRING)


def interact(obj, src):
    var = False
    for i in l:
        if obj.condition == i.name and i.interacted == True:
            var = True
    if var == True:
        for i in l:
            #Using eventcall
            if obj.eventcall == i.name:
                    interact(i, obj)


pygame.init()

newloc = loc("lol", 100, 100, False, "Blue")
obj2 = loc("lolol", 180, 100, False, "Blue")

l.append(newloc)
l.append(obj2)

print(newloc.name)

#Keep window at a 16:9 ratio (or 1:1.6)
size = width, height = 800, 500
color = r, g, b = 0, 0, 255

screen = pygame.display.set_mode(size)

player = pygame.Rect(400, 250, 40, 40)
pygame.draw.rect(screen, (255, 0, 0), player)

for obj in l:
    pygame.draw.rect(screen, color, pygame.Rect(obj.x, obj.y, 40, 40))

pygame.display.update()

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            sys.exit()
    #time.sleep(1)
