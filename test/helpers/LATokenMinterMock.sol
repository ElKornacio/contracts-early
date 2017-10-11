pragma solidity ^0.4.15;

import '../../contracts/LATokenMinter.sol';

contract LATokenMinterMock is LATokenMinter {
  uint256 public timeStamp = now;

  function setBlockTimestamp(uint256 _timeStamp) public {
    timeStamp = _timeStamp;
  }

  function getBlockTimestamp() returns (uint256) {
    return timeStamp;
  }

  function LATokenMinterMock(address _LATTokenAddress, address _helperAddress)
    LATokenMinter(_LATTokenAddress, _helperAddress)
  {
  }

}
