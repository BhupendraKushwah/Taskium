import PropTypes from "prop-types";
const Navbar = ({ handleSideNav }) => {
    return (
        <div className="w-full">
            <nav className="navbar">
                <div className="sidebar-button cursor-pointer" onClick={handleSideNav}>
                    <i className="fu ph-fill ph-text-indent text-4xl text-primary"></i>
                </div>
                <div className="right-nav flex items-center gap-2 ">
                    <div className="bell cursor-pointer">
                        <i className="fu ph-fill ph-bell fs24 text-icon-base "></i>
                    </div>
                    <div className="user-pic">
                        <div className="dropdown">
                            <div className="profile">
                                <img src="https://dummyimage.com/64x82/000/fff" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

Navbar.propTypes = {
    handleSideNav: PropTypes.func.isRequired
}
export default Navbar;