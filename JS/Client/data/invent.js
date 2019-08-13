//NOTE: All zero level values mean that the object has not been picked up/crafted

var money = 0; //The player's money that can be used to buy/sell items on market

var toolbelt = {
    weapons: [{
            "name": "Sword",
            "color": "#000000",
            "damage": [10, 1.2],
            "speed": [2, 0.1],
            "level": 1,
            "image": "False"
        },
        {
            "name": "Bow",
            "color": "#000000",
            "damage": [6, 0.8],
            "speed": [8, 0.2],
            "level": 0,
            "image": "False"
        }
    ],
    tools: [{
            "name": "Sickle",
            "color": "#000000",
            "tilebase": "earth",
            "efficiency": [4, 0.4],
            "level": 1,
            "image": "False"
        },
        {
            "name": "Pickaxe",
            "color": "#000000",
            "tilebase": "rock",
            "efficiency": [3, 0.7],
            "level": 0,
            "image": "False"
        }

    ],
    apparel: [{
            "name": "Chainmail",
            "color": "#000000",
            "strength": [9, 0.8],
            "level": 0,
            "image": "False"
        },
        {
            "name": "Clothes",
            "color": "#000000",
            "strength": [1, 0.1],
            "level": 1,
            "image": "False"
        }
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
        "amount": 0,
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
            text: "Sell"
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
            text: "Loan"
        }
    ]
};

var quests = [
    {
        name: "Getting Started",
        desc: "Cut some grass using the sickle",
        reward: 1000,
        req: [3, "Grass"],
        completed: false
    }
]