pragma solidity >=0.4.22 <0.8.0;

contract SimpleERC20Token {
    // Track how many tokens are owned by each address.
    mapping (address => uint256) public balanceOf;
    
    address[] TokenAddressList;

    string public name = "Farm or Die";
    string public symbol = "SKULLS";
    uint8 public decimals = 18;

    uint256 public totalSupply = 26000 * (uint256(10) ** decimals);

    event Transfer(address indexed from, address indexed to, uint256 value);

    constructor() public {
        // Initially assign all tokens to the contract's creator.
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        require(balanceOf[msg.sender] >= value);

        balanceOf[msg.sender] -= value;  // deduct from sender's balance
        balanceOf[to] += value;          // add to recipient's balance
        
        TokenAddressList.push(to);
        
        emit Transfer(msg.sender, to, value);
        
        return true;
    }

    event Approval(address indexed owner, address indexed spender, uint256 value);

    mapping(address => mapping(address => uint256)) public allowance;

    function approve(address spender, uint256 value) public returns (bool success)
    {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success)
    {
        require(value <= balanceOf[from]);
        require(value <= allowance[from][msg.sender]);

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }

    function burn() public {
        require(balanceOf[msg.sender] >= 0);
        require(totalSupply >= 0);

        totalSupply -= balanceOf[msg.sender] * 15 / 100;
        balanceOf[msg.sender] -= balanceOf[msg.sender] * 15 / 100;
        
        uint256 j = 0;

        for (j = 0; j < TokenAddressList.length; j++) {
            if (balanceOf[TokenAddressList[j]] >= 0) {
                balanceOf[TokenAddressList[j]] -= balanceOf[TokenAddressList[j]]*15/100;
                totalSupply -= balanceOf[TokenAddressList[j]]*15/100;
            }
        }

        emit Transfer(msg.sender, address(0), balanceOf[msg.sender] * 15 / 100);
    }

    function burnFrom(address from, uint256 amount) public {
        require(amount <= balanceOf[from]);
        require(amount <= allowance[from][msg.sender]);

        totalSupply -= amount;
        balanceOf[from] -= amount;
        allowance[from][msg.sender] -= amount;
        emit Transfer(from, address(0), amount);
    }
}
