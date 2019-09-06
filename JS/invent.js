//NOTE: All zero level values mean that the object has not been picked up/crafted

var money = 10000; //The player's money that can be used to buy/sell items on market
var debt = 0;

let quests = [];

var toolbelt = {
    weapons: [{
            "name": "Sword",
            "color": "#000000",
            "damage": [8, 2],
            "mod": 2,
            "speed": [20, 1],
            "level": 1,
            "image": "False",
            "cost":[1500, 1500],
            "wc":"w"
        },
        {
            "name": "Fire Spell",
            "color": "#000000",
            "damage": [15, 5],
            "speed": [80, 2],
            "mod": 15,
            "level": 1,
            "image": "False",
            "maCost": [10, 5],
            "cost": [1500, 1500],
            "wc": "s"
        },
        {
            "name": "old wodden sword",
            "color": "#000000",
            "damage": [1, 1],
            "mod": 0,
            "speed": [20, 1],
            "level": 1,
            "image": "False",
            "cost":[500, 1500],
            "wc": "w"
        }
    ],
    tools: [{
            "name": "Sickle",
            "color": "#000000",
            "tilebase": "grass",
            "efficiency": [40, 4],
            "level": 1,
            "image": "False",
            "cost": [110, 8]
        },
        {
            "name": "Axe",
            "color": "#000000",
            "tilebase": "forest",
            "efficiency": [12, 2],
            "level": 1,
            "image": "False",
            "cost": [80, 10]
        },
        {
            "name": "Pickaxe",
            "color": "#000000",
            "tilebase": "mountain",
            "efficiency": [30, 7],
            "level": 0,
            "image": "False",
            "cost": [290, 2]
        }

    ],
    apparel: [
        {
            "name": "Iron Armour",
            "color": "#000000",
            "ac": [10, 1],
            "level": 1,
            "image": "False",
            "cost": [2000, 2000]
        },{
            "name": "Chainmail",
            "color": "#000000",
            "ac": [18, 2],
            "level": 0,
            "image": "False",
            "cost": [2000, 100]
        },
        {
            "name": "Clothes",
            "color": "#000000",
            "ac": [0, 0],
            "level": 0,
            "image": "False",
            "cost": [20, 1]
        },
        
    ]
};

//Item management
var inventory = [{
        "name": "Rock",
        "color": "#666633",
        "amount": 0,
        "image": "False",
        "cost": 100,
        "stock": 35,
        "tile": "mountain"
    },
    {
        "name": "Water",
        "color": "#0033cc",
        "amount": 10,
        "image": "False",
        "cost": 120,
        "stock": 110,
        "tile": "water"
    },
    {
        "name": "Wood",
        "color": "#550011",
        "amount": 10,
        "image": "False",
        "cost": 1000,
        "stock": 0,
        "tile": "forest"
    },
    {
        "name": "Lava",
        "color": "#cc6600",
        "amount": 0,
        "image": "False",
        "cost": 3200,
        "stock": 92,
        "tile": "lava"
    },
    {
        "name": "Grass",
        "color": "#00ff00",
        "amount": 0,
        "image": "False",
        "cost": 25,
        "stock": 9,
        "tile": "grass"
    },
    {
        "name": "Sticks",
        "color": "#00ff00",
        "amount": 0,
        "image": "False",
        "cost": 32,
        "stock": 0,
        "tile": null
    },
    {
        "name": "Snowball",
        "color": "#dddddd",
        "amount": 0,
        "image": "False",
        "cost": 35,
        "stock": 0,
        "tile": "snow"
    }
];

var ButtonPresets = {
    "toolbelt": [{
            onclick: "updateInvent(0, 'toolbelt_weapons');",
            text: "Weapons"
        },
        {
            onclick: "updateInvent(0, 'toolbelt_tools');",
            text: "Tools"
        },
        {
            onclick: "updateInvent(0, 'toolbelt_apparel');",
            text: "Apparel"
        }
    ],
    "inventory": [{
            onclick: "",
            text: "Put in Table"
        },
        {
            onclick: "",
            text: "Craft"
        },
        {
            onclick: "",
            text: "Sell (5)"
        }
    ],
    "quests": [{
            onclick: "",
            text: "Remove"
        },
        {
            onclick: "",
            text: "Complete"
        },
        {
            onclick: "",
            text: "Prioritize"
        }
    ],
    "market": [{
            onclick: "",
            text: "Buy (1)"
        },
        {
            onclick: "",
            text: "Buy (10)"
        },
        {
            onclick: "",
            text: "Loan (10000)"
        }
    ]
};

const questbank = [{
        name: "Getting Started",
        desc: "Cut some grass using the sickle",
        reward: 1000,
        req: [3, "Grass"],
        completed: false,
        npc:"villager",
        banked: false
    },
    {
        name: "Caveman",
        desc: "Craft a stick",
        reward: 2000,
        req: [1, "Sticks"],
        completed: false,
        npc: "villager",
        banked: false
    },
    {
        name: "LumberJack",
        desc: "Chop some wood in the forest",
        reward: 1300,
        req: [5, "Wood"],
        completed: false,
        npc: "farmer",
        banked: false
}];


var CraftingRecipes = [
    [["Wood", "Wood"], ["Sticks", "invent"], [1, 1, 2]],
    [["Sticks", "Rock"], ["Pickaxe", "toolbelt"], [23, 43, 103]],
    [["Lava", "Water"], ["Rock", "invent"], [13, 134, 189]],
    [["Lava", "Rock"], ["Chainmail", "toolbelt"], [3, 13, 132]],
    [["Wood", "Grass"], ["Bow", "toolbelt"], [13, 40, 81]]
];
