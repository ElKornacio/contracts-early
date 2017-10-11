pragma solidity ^0.4.15;

import "./base-token/LATToken.sol";
import "./lib/SafeMath.sol";

contract LATokenMinter {
    using SafeMath for uint256;

    LATToken public token; // Token contract

    address public founder; // Address of founder
    address public helper;  // Address of helper

    address public teamPoolInstant; // Address of team pool for instant issuance after token sale end
    address public teamPoolForFrozenTokens; // Address of team pool for smooth unfroze during 5 years after 5 years from token sale start

    bool public teamInstantSent = false; // Flag to prevent multiple issuance for team pool after token sale

    uint public startTime;               // Unix timestamp of start
    uint public endTime;                 // Unix timestamp of end
    uint public numberOfDays;            // Number of windows after 0
    uint public unfrozePerDay;           // Tokens sold in each window
    uint public alreadyHarvestedTokens;  // Tokens were already harvested and sent to team pool

    /*
     *  Modifiers
     */
    modifier onlyFounder() {
        // Only founder is allowed to do this action.
        if (msg.sender != founder) {
            revert();
        }
        _;
    }

    modifier onlyHelper() {
        // Only helper is allowed to do this action.
        if (msg.sender != helper) {
            revert();
        }
        _;
    }

    function fundTeamInstant()
        external
        onlyFounder
        returns (bool)
    {
        require(!teamInstantSent);

        uint baseValue = 400000000;
        uint totalInstantAmount = baseValue.mul(1000000); // 400 millions with 6 decimal points

        require(token.issueTokens(teamPoolInstant, totalInstantAmount));

        teamInstantSent = true;
        return true;
    }

    function changeTokenAddress(address newAddress)
        external
        onlyFounder
        returns (bool)
    {
        token = LATToken(newAddress);
        return true;
    }

    function changeFounder(address newAddress)
        external
        onlyFounder
        returns (bool)
    {
        founder = newAddress;
        return true;
    }

    function changeHelper(address newAddress)
        external
        onlyFounder
        returns (bool)
    {
        helper = newAddress;
        return true;
    }

    function changeTeamPoolInstant(address newAddress)
        external
        onlyFounder
        returns (bool)
    {
        teamPoolInstant = newAddress;
        return true;
    }

    function changeTeamPoolForFrozenTokens(address newAddress)
        external
        onlyFounder
        returns (bool)
    {
        teamPoolForFrozenTokens = newAddress;
        return true;
    }

    function harvest()
        external
        onlyHelper
        returns (uint)
    {
        uint currentTimeDiff = getBlockTimestamp().sub(startTime);
        uint secondsPerDay = 24 * 3600;
        uint daysFromStart = currentTimeDiff.div(secondsPerDay);
        uint currentDay = daysFromStart.add(1);

        if (getBlockTimestamp() >= endTime) {
            currentTimeDiff = endTime.sub(startTime).add(1);
            currentDay = 5 * 365;
        }

        uint maxCurrentHarvest = currentDay.mul(unfrozePerDay);
        uint wasNotHarvested = maxCurrentHarvest.sub(alreadyHarvestedTokens);

        require(token.issueTokens(teamPoolForFrozenTokens, wasNotHarvested));
        alreadyHarvestedTokens = alreadyHarvestedTokens.add(wasNotHarvested);

        return wasNotHarvested;
    }

    function LATokenMinter(address _LATTokenAddress, address _helperAddress) {
        founder = msg.sender;
        helper = _helperAddress;
        token = LATToken(_LATTokenAddress);

        numberOfDays = 5 * 365; // 5 years
        startTime = 1661166000; // 22 august 2017 11:00 GMT+0;
        endTime = numberOfDays.mul(1 days).add(startTime);

        uint baseValue = 600000000;
        uint frozenTokens = baseValue.mul(1000000); // 600 millions with 6 decimal points
        alreadyHarvestedTokens = 0;

        unfrozePerDay = frozenTokens.div(numberOfDays);
    }

    function () payable {
        require(false);
    }

    function getBlockTimestamp() returns (uint256) {
        return block.timestamp;
      }
}
