const continents = [
    {
        _id: 1,
        name: "Africa",
    },

    {
        _id: 2,
        name: "Europe",
    },

    {
        _id: 3,
        name: "Asia",
    },

    {
        _id: 4,
        name: "North America",
    },

    {
        _id: 5,
        name: "South America",
    },

    {
        _id: 6,
        name: "Australia",
    },

    {
        _id: 7,
        name: "Antarctica",
    },
];

const prices = [
    {
        _id: 0,
        name: "모두",
        array: [],
    },

    {
        _id: 1,
        name: "0 ~ 1만원",
        array: [0, 10000],
    },

    {
        _id: 2,
        name: "만원 ~ 5만원",
        array: [10000, 50000],
    },

    {
        _id: 3,
        name: "5만원 ~ 10만원",
        array: [50000, 100000],
    },

    {
        _id: 4,
        name: "10만원 ~ 50만원",
        array: [100000, 500000],
    },

    {
        _id: 5,
        name: "50만원 이상",
        array: [500000, 90000000],
    },
];

export { continents, prices };
