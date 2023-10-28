import { Link } from "react-router-dom";
import './Users.css';

export const Users = ({ users }) => {
    const tableHeadStyles = {
        fontWeight: 'bold'
    }

    return (
        <div className="users">
            <h1>Users</h1>
            <table>
                <thead>
                    <tr style={tableHeadStyles}>
                        <td>User Name</td>
                        <td>Blogs Created</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => {
                        return (
                            <tr key={user.id}>
                                <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
                                <td>{user.blogs.length}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
