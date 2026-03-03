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

// const getGrowthPrediction = async (req, res) => {
//   try {
//     const now = new Date();
//     const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

//     // Get daily signups for last 30 days
//     const dailyData = await User.aggregate([
//       { $match: { createdAt: { $gte: thirtyDaysAgo } } },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } }
//     ]);

//     // Fill missing days with 0
//     const signupsByDay = {};
//     dailyData.forEach(d => signupsByDay[d._id] = d.count);

//     const historicalData = [];
//     for (let i = 29; i >= 0; i--) {
//       const date = new Date(now - i * 24 * 60 * 60 * 1000);
//       const dateStr = date.toISOString().split('T')[0];
//       historicalData.push({ date: dateStr, count: signupsByDay[dateStr] || 0 });
//     }

//     // Calculate linear regression (y = mx + b)
//     const n = historicalData.length;
//     let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
//     historicalData.forEach((d, i) => {
//       sumX += i;
//       sumY += d.count;
//       sumXY += i * d.count;
//       sumX2 += i * i;
//     });

//     const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
//     const intercept = (sumY - slope * sumX) / n;

//     // Predict next 30 days
//     const dailyForecast = [];
//     let predictedTotal = 0;
//     for (let i = 1; i <= 30; i++) {
//       const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
//       const predicted = Math.max(0, Math.round(slope * (n + i) + intercept));
//       predictedTotal += predicted;
//       dailyForecast.push({
//         date: date.toISOString().split('T')[0],
//         predicted
//       });
//     }

//     // Calculate confidence (based on variance)
//     const avgDaily = sumY / n;
//     const variance = historicalData.reduce((acc, d) => acc + Math.pow(d.count - avgDaily, 2), 0) / n;
//     const confidence = Math.max(0, Math.min(100, Math.round(100 - variance * 5)));

//     // Determine trend
//     const trend = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'declining' : 'stable';

//     const totalUsers = await User.countDocuments();

//     res.json({
//       current: {
//         totalUsers,
//         last30DaysGrowth: Math.round(sumY),
//         avgDailySignups: +(sumY / n).toFixed(2)
//       },
//       prediction: {
//         next30Days: predictedTotal,
//         projectedTotal: totalUsers + predictedTotal,
//         growthTrend: trend,
//         confidenceScore: confidence
//       },
//       historicalData,
//       dailyForecast
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Prediction failed', details: error.message });
//   }
// };

const getGrowthPrediction = async (req, res) => {
  try {
    const { filterType, month, startDate, endDate, forecastDays: forecastDaysParam } = req.query;
    const now = new Date();
    let start, end;

    switch (filterType) {
      case 'last7':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        end = new Date(now);
        break;

      case 'last30':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        end = new Date(now);
        break;

      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now);
        break;

      case 'month':
        if (!month || !/^\d{4}-\d{1,2}$/.test(month)) {
          return res.status(400).json({ message: 'For filterType=month, provide month as YYYY-MM (e.g. 2025-12)' });
        }
        const [y, m] = month.split('-').map(Number);
        start = new Date(y, m - 1, 1);
        end = new Date(y, m, 0);
        break;

      case 'custom':
        if (!startDate || !endDate) {
          return res.status(400).json({ message: 'For filterType=custom, provide startDate and endDate (ISO date strings)' });
        }
        start = new Date(startDate);
        end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          return res.status(400).json({ message: 'Invalid startDate or endDate' });
        }
        if (start > end) {
          return res.status(400).json({ message: 'startDate must be before endDate' });
        }
        break;

      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        end = new Date(now);
    }

    const forecastDays = Math.min(Math.max(Number(forecastDaysParam) || 30, 1), 90);

    const dailyData = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'UTC' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const signupsByDay = {};
    dailyData.forEach(d => { signupsByDay[d._id] = d.count; });

    const diffMs = end.getTime() - start.getTime();
    const totalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1);

    const historicalData = [];
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      historicalData.push({
        date: dateStr,
        count: signupsByDay[dateStr] || 0
      });
    }

    const n = historicalData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    historicalData.forEach((d, i) => {
      sumX += i;
      sumY += d.count;
      sumXY += i * d.count;
      sumX2 += i * i;
    });

    const denominator = n * sumX2 - sumX * sumX;
    const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
    const intercept = n === 0 ? 0 : (sumY - slope * sumX) / n;

    const dailyForecast = [];
    let predictedTotal = 0;
    for (let i = 1; i <= forecastDays; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const predicted = Math.max(0, Math.round(slope * (n + i) + intercept));
      predictedTotal += predicted;
      dailyForecast.push({
        date: date.toISOString().split('T')[0],
        predicted
      });
    }

    const avgDaily = n === 0 ? 0 : sumY / n;
    const variance = n === 0 ? 0 : historicalData.reduce((acc, d) => acc + Math.pow(d.count - avgDaily, 2), 0) / n;
    const confidence = Math.max(0, Math.min(100, Math.round(100 - variance * 5)));
    const trend = slope > 0.1 ? 'increasing' : slope < -0.1 ? 'declining' : 'stable';

    const totalUsers = await User.countDocuments();

    res.json({
      range: {
        filterType: filterType || 'last30',
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
        days: n,
        forecastDays
      },
      current: {
        totalUsers,
        periodGrowth: Math.round(sumY),
        avgDailySignups: +(avgDaily).toFixed(2)
      },
      prediction: {
        nextPeriod: predictedTotal,
        projectedTotal: totalUsers + predictedTotal,
        growthTrend: trend,
        confidenceScore: confidence
      },
      historicalData,
      dailyForecast
    });
  } catch (error) {
    res.status(500).json({ message: 'Prediction failed', details: error.message });
  }
};

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
  filterUsers,
  getGrowthPrediction
};
