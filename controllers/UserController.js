const userService = require('../services/UserService');


class UserController {

    async paginated(req, res) {
        try {
            const { search, sortField, sortOrder, page, pageSize, filterBy } = req.query;
            
            const userList = await userService.paginated({ search, sortField, sortOrder, page, pageSize, filterBy });
        
            res.status(200).json(userList);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    async create(req, res) {
        try {
            const newUser = await userService.create(req.body);
    
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json(error);
        }
    }

    async show(req, res) {
        try {
            const user = await userService.show(req.params.user_id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    }
  
    async update(req, res) {
        try {
            const user = await userService.update(req.params.user_id, req.body);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    // Delete method to set user's deleted_at which marks it at deleted for application, but not deleted in DB
    async deactivate(req, res) {
        try {
            const success = await userService.deactivate(req.params.user_id);

            if (success) {
                res.status(200).json({ message: 'User successfully deactivated' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    // Delete method to completely delete user from the DB, only possible if user was previously soft deleted
    async delete(req, res) {
        try {
            const success = await userService.delete(req.params.user_id);

            if (success) {
                res.status(200).json({ message: 'User deleted successfully' });
            } else {
                res.status(404).json({ error: 'User not found or not soft deleted' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    // Update method to remove soft delete from user
    async activate(req, res) {
        try {
            const success = await userService.activate(req.params.user_id);

            if (success) {
                res.status(200).json({message: "User successfully activated"});
            } else {
                res.status(404).json({ error: 'User not found or not was not soft deleted' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
  }

module.exports = new UserController();
