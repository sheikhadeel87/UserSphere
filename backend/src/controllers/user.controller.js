const mongoose = require('mongoose');
const User = require('../models/user.model');

async function createUser(req, res, next) {
  try {
    if (req.body.city) {
      req.body.city = req.body.city.trim().toLowerCase();
    }
    const user = await User.create(req.body);
    return res.status(201).json({ message: 'User created', data: user });
  } catch (error) {
    return next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const { page = 1, limit = 10, city, isActive, minAge, maxAge, sort = '-createdAt' } = req.query;
    const filter = {};

    if (city) filter.city = city;
    if (typeof isActive !== 'undefined') filter.isActive = isActive === 'true';

    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = Number(minAge);
      if (maxAge) filter.age.$lte = Number(maxAge);
    }

    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    // Dynamic sorting
    const sortParam = sort || 'name';
    const sortObj = {};
    if (sortParam.startsWith('-')) {
      sortObj[sortParam.slice(1)] = -1;
    } else {
      sortObj[sortParam] = 1;
    }
    const [users, total] = await Promise.all([
      User.find(filter).sort(sortObj).skip(skip).limit(safeLimit),
      User.countDocuments(filter)
    ]);

    return res.json({
      message: 'Users fetched',
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit)
      },
      data: Array.isArray(users) ? users : []
    });
  } catch (error) {
    return next(error);
  }
}

async function getUserNames(req, res, next) {
  try {
    const names = await User.aggregate([
      { $group: { _id: "$name" } }
    ]);
    // Return as an array of names
    res.json({ names: names.map(n => n._id) });
  } catch (error) {
    return next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ message: 'User fetched', data: user });
  } catch (error) {
    return next(error);
  }
}

async function replaceUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });
    if (req.body.city) {
      req.body.city = req.body.city.trim().toLowerCase();
    }
    const user = await User.findOneAndReplace({ _id: id }, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User replaced', data: user });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });
    if (req.body.city) {
      req.body.city = req.body.city.trim().toLowerCase();
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ message: 'User updated', data: user });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid user id' });

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ message: 'User deleted' });
  } catch (error) {
    return next(error);
  }
}

async function getUserStats(req, res, next) {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$city',
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          averageAge: { $avg: '$age' }
        }
      },
      {
        $project: {
          _id: 0,
          city: {
            $cond: [
              { $ifNull: ['$_id', false] },
              {
                $concat: [
                  { $toUpper: { $substr: ['$_id', 0, 1] } },
                  { $toLower: { $substr: ['$_id', 1, { $strLenCP: '$_id' }] } }
                ]
              },
              'Unknown'
            ]
          },
          totalUsers: 1,
          activeUsers: 1,
          averageAge: { $round: ['$averageAge', 2] }
        }
      },
      { $sort: { totalUsers: -1 } }
    ]);

    return res.json({ message: 'User stats fetched', data: stats });
  } catch (error) {
    return next(error);
  }
}

// async function getUserByAge(req, res, next) {
//   try {
// const from = Number(req.query.from) || 20;
// const to = Number(req.query.to) || 30;

//     const user = await User.aggregate([
//       { $match: { age: { $gte: from, $lte: to}}}
//     ])
//     return res.json({ message: 'Users fetched by age', data: user });
//   } catch (error) {
//     return next(error);
//   }
// }

// async function getUserNames(req, res, next) {
//   try {
//     const names = await User.aggregate([
//       { $match: { isActive: false } }, // Only inactive users
//       { $group: { _id: "$name" } }
//     ]);
//     // Return as an array of names
//     res.json({ names: names.map(n => n._id) });
//   } catch (error) {
//     return next(error);
//   }
// }


// Combined stats: total users, total cities, city names

async function getGeneralStats(req, res, next) {
  try {
    const [userCountResult, cityAgg] = await Promise.all([
      User.aggregate([{ $count: "totalUsers" }]),
      User.aggregate([
        { $group: { _id: "$city" } },
        { $project: {
            _id: 0,
            city: {
              $cond: [
                { $ifNull: ['$_id', false] },
                {
                  $concat: [
                    { $toUpper: { $substr: ['$_id', 0, 1] } },
                    { $toLower: { $substr: ['$_id', 1, { $strLenCP: '$_id' }] } }
                  ]
                },
                'Unknown'
              ]
            }
          }
        }
      ])
    ]);
    const totalUsers = userCountResult[0]?.totalUsers || 0;
    const cityNames = cityAgg.map(c => c.city).filter(Boolean);
    const totalCities = cityNames.length;
    res.json({
      success: true,
      totalUsers,
      totalCities,
      cityNames
    });
  } catch (error) {
    return next(error);
  }
}

async function filterUsers(req, res, next) {
  try {
    const { search, ageFrom, ageTo, isActive } = req.query;
    const match = {};

    if (search) {
      match.$or = [
        { name: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (ageFrom || ageTo) {
      match.age = {};
      if (ageFrom) match.age.$gte = Number(ageFrom);
      if (ageTo) match.age.$lte = Number(ageTo);
    }
    if (isActive === 'true') match.isActive = true;
    if (isActive === 'false') match.isActive = false;

    const users = await User.aggregate([
      { $match: match }
    ]);
    res.json({ message: 'Filtered users', data: users });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  replaceUser,
  updateUser,
  deleteUser,
  getUserStats,
  getGeneralStats,
  getUserNames,
  // getUserByAge,
  filterUsers
};
