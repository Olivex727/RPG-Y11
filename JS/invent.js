//NOTE: All zero level values mean that the object has not been picked up/crafted

let money = 0; //The player's money that can be used to buy/sell items on market
let debt = 0; //The amount of money the player owes

//Tools that the player can use
var toolbelt = {
    weapons: [{
            "name": "Sword",
            "color": "#000000",
            "damage": [8, 2],
            "mod": 2,
            "speed": [20, 1],
            "level": 1,
            "image": "False",
            "cost":[1500, 1500]
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
            "cost": [1500, 1500]
        }
    ],
    tools: [],
    apparel: []
};

//Item management
var inventory = [];

//Player Quests
var quests = [];

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
